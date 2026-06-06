// Time zones configuration
const TIMEZONES = {
    'America/New_York': { city: 'New York', offset: -5, region: 'Americas' },
    'America/Los_Angeles': { city: 'Los Angeles', offset: -8, region: 'Americas' },
    'America/Chicago': { city: 'Chicago', offset: -6, region: 'Americas' },
    'America/Denver': { city: 'Denver', offset: -7, region: 'Americas' },
    'America/Toronto': { city: 'Toronto', offset: -5, region: 'Americas' },
    'America/Mexico_City': { city: 'Mexico City', offset: -6, region: 'Americas' },
    'America/Buenos_Aires': { city: 'Buenos Aires', offset: -3, region: 'Americas' },
    'America/Sao_Paulo': { city: 'São Paulo', offset: -3, region: 'Americas' },
    
    'Europe/London': { city: 'London', offset: 0, region: 'Europe' },
    'Europe/Paris': { city: 'Paris', offset: 1, region: 'Europe' },
    'Europe/Berlin': { city: 'Berlin', offset: 1, region: 'Europe' },
    'Europe/Madrid': { city: 'Madrid', offset: 1, region: 'Europe' },
    'Europe/Rome': { city: 'Rome', offset: 1, region: 'Europe' },
    'Europe/Amsterdam': { city: 'Amsterdam', offset: 1, region: 'Europe' },
    'Europe/Moscow': { city: 'Moscow', offset: 3, region: 'Europe' },
    'Europe/Istanbul': { city: 'Istanbul', offset: 3, region: 'Europe' },
    
    'Africa/Cairo': { city: 'Cairo', offset: 2, region: 'Africa' },
    'Africa/Lagos': { city: 'Lagos', offset: 1, region: 'Africa' },
    'Africa/Johannesburg': { city: 'Johannesburg', offset: 2, region: 'Africa' },
    'Africa/Nairobi': { city: 'Nairobi', offset: 3, region: 'Africa' },
    
    'Asia/Dubai': { city: 'Dubai', offset: 4, region: 'Asia' },
    'Asia/Kolkata': { city: 'India', offset: 5.5, region: 'Asia' },
    'Asia/Bangkok': { city: 'Bangkok', offset: 7, region: 'Asia' },
    'Asia/Hong_Kong': { city: 'Hong Kong', offset: 8, region: 'Asia' },
    'Asia/Shanghai': { city: 'Shanghai', offset: 8, region: 'Asia' },
    'Asia/Tokyo': { city: 'Tokyo', offset: 9, region: 'Asia' },
    'Asia/Seoul': { city: 'Seoul', offset: 9, region: 'Asia' },
    'Asia/Singapore': { city: 'Singapore', offset: 8, region: 'Asia' },
    'Asia/Jakarta': { city: 'Jakarta', offset: 7, region: 'Asia' },
    
    'Pacific/Sydney': { city: 'Sydney', offset: 10, region: 'Pacific' },
    'Pacific/Auckland': { city: 'Auckland', offset: 12, region: 'Pacific' },
    'Pacific/Fiji': { city: 'Fiji', offset: 12, region: 'Pacific' },
    'Pacific/Honolulu': { city: 'Honolulu', offset: -10, region: 'Pacific' },
    
    'Australia/Melbourne': { city: 'Melbourne', offset: 10, region: 'Australia' },
    'Australia/Brisbane': { city: 'Brisbane', offset: 10, region: 'Australia' },
    'Australia/Perth': { city: 'Perth', offset: 8, region: 'Australia' },
};

// Default clocks to display
const DEFAULT_CLOCKS = ['America/New_York', 'Europe/London', 'Asia/Tokyo', 'Australia/Sydney'];

// Storage key for saved clocks
const STORAGE_KEY = 'selectedTimezones';

// Current selected clocks
let selectedClocks = [];

// Initialize the application
function init() {
    populateTimezoneSelector();
    loadSavedClocks();
    if (selectedClocks.length === 0) {
        selectedClocks = DEFAULT_CLOCKS;
    }
    renderClocks();
    updateClocks();
    // Update every second
    setInterval(updateClocks, 1000);
}

// Populate timezone dropdown
function populateTimezoneSelector() {
    const select = document.getElementById('timezoneSelect');
    const regions = {};

    // Group timezones by region
    Object.entries(TIMEZONES).forEach(([tz, data]) => {
        if (!regions[data.region]) {
            regions[data.region] = [];
        }
        regions[data.region].push({ tz, data });
    });

    // Create optgroups
    Object.entries(regions).forEach(([region, timezones]) => {
        const optgroup = document.createElement('optgroup');
        optgroup.label = region;
        
        timezones.forEach(({ tz, data }) => {
            const option = document.createElement('option');
            option.value = tz;
            option.textContent = `${data.city} (UTC${data.offset >= 0 ? '+' : ''}${data.offset})`;
            optgroup.appendChild(option);
        });
        
        select.appendChild(optgroup);
    });
}

// Add a new clock
function addClock() {
    const select = document.getElementById('timezoneSelect');
    const tz = select.value;

    if (!tz) {
        alert('Please select a timezone');
        return;
    }

    if (!selectedClocks.includes(tz)) {
        selectedClocks.push(tz);
        saveClocks();
        renderClocks();
    }

    select.value = '';
}

// Remove a clock
function removeClock(tz) {
    selectedClocks = selectedClocks.filter(t => t !== tz);
    saveClocks();
    renderClocks();
}

// Save clocks to localStorage
function saveClocks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedClocks));
}

// Load clocks from localStorage
function loadSavedClocks() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            selectedClocks = JSON.parse(saved);
        } catch (e) {
            selectedClocks = [];
        }
    }
}

// Reset to default clocks
function resetClocks() {
    selectedClocks = [...DEFAULT_CLOCKS];
    saveClocks();
    renderClocks();
}

// Render all clock cards
function renderClocks() {
    const container = document.getElementById('clocksContainer');
    
    if (selectedClocks.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1;">
                <div class="empty-state">
                    <i class="fas fa-globe"></i>
                    <p>No timezones selected. Add one to get started!</p>
                </div>
            </div>
        `;
        return;
    }

    container.innerHTML = selectedClocks.map(tz => {
        const tzData = TIMEZONES[tz];
        return `
            <div class="clock-card" id="clock-${tz}">
                <button class="remove-btn" onclick="removeClock('${tz}')">
                    <i class="fas fa-times"></i>
                </button>
                <div class="timezone-name">${tz}</div>
                <div class="city-name">${tzData.city}</div>
                <div class="digital-time" id="time-${tz}">--:--:--</div>
                <div class="time-period" id="period-${tz}">--</div>
                <div class="analog-clock">
                    <div class="hand hour-hand" id="hour-${tz}"></div>
                    <div class="hand minute-hand" id="minute-${tz}"></div>
                    <div class="hand second-hand" id="second-${tz}"></div>
                    <div class="clock-center"></div>
                </div>
                <div class="info-section">
                    <div class="info-item">
                        <i class="fas fa-calendar"></i>
                        <div>
                            <span class="label">Date</span>
                            <div class="value" id="date-${tz}">--/--</div>
                        </div>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-globe"></i>
                        <div>
                            <span class="label">UTC Offset</span>
                            <div class="value" id="offset-${tz}">UTC${tzData.offset >= 0 ? '+' : ''}${tzData.offset}</div>
                        </div>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-sun"></i>
                        <div>
                            <span class="label">Region</span>
                            <div class="value">${tzData.region}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Update all clock displays
function updateClocks() {
    const now = new Date();

    selectedClocks.forEach(tz => {
        const tzData = TIMEZONES[tz];
        
        // Calculate time in timezone
        const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
        const tzTime = new Date(utcTime + tzData.offset * 3600000);

        // Update digital time
        const hours = String(tzTime.getHours()).padStart(2, '0');
        const minutes = String(tzTime.getMinutes()).padStart(2, '0');
        const seconds = String(tzTime.getSeconds()).padStart(2, '0');
        
        document.getElementById(`time-${tz}`).textContent = `${hours}:${minutes}:${seconds}`;

        // Update AM/PM
        const hour = tzTime.getHours();
        const period = hour >= 12 ? 'PM' : 'AM';
        document.getElementById(`period-${tz}`).textContent = period;

        // Update date
        const month = String(tzTime.getMonth() + 1).padStart(2, '0');
        const date = String(tzTime.getDate()).padStart(2, '0');
        document.getElementById(`date-${tz}`).textContent = `${month}/${date}`;

        // Update analog clock hands
        const hourDegrees = (hour % 12) * 30 + (tzTime.getMinutes() / 60) * 30;
        const minuteDegrees = tzTime.getMinutes() * 6 + (tzTime.getSeconds() / 60) * 6;
        const secondDegrees = tzTime.getSeconds() * 6;

        document.getElementById(`hour-${tz}`).style.transform = `rotate(${hourDegrees}deg)`;
        document.getElementById(`minute-${tz}`).style.transform = `rotate(${minuteDegrees}deg)`;
        document.getElementById(`second-${tz}`).style.transform = `rotate(${secondDegrees}deg)`;

        // Highlight current timezone (local time)
        const card = document.getElementById(`clock-${tz}`);
        const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (tz === localTz) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });
}

// Handle Enter key in timezone selector
document.addEventListener('DOMContentLoaded', function() {
    init();
    
    const select = document.getElementById('timezoneSelect');
    select.addEventListener('change', function() {
        if (this.value) {
            addClock();
        }
    });
});
