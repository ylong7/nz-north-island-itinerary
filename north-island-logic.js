let currentFrame = 0;
let map, highlightLayer;
let markers = [];
let polylines = [];

// Initialize Map
map = L.map('map', { zoomControl: false, attributionControl: false }).setView(locs.nz.c, locs.nz.z);
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(map);

// Add Collision Resolver to Map Events
map.on('zoomend moveend', () => setTimeout(autoResolveCollisions, 100));

// Load GeoJSON Highlight
fetch('https://raw.githubusercontent.com/fretis/geojson-new-zealand/master/dist/north-island.geojson')
    .then(res => res.json()).then(data => { 
        highlightLayer = L.geoJSON(data, { className: 'ni-highlight' }); 
        // Force update UI once highlight is ready
        updateUI();
    });

// Sidebar Initialization
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    frameTitles.forEach((title, index) => {
        const numStr = String(index).padStart(2, '0');
        const div = document.createElement('div');
        div.className = 'sidebar-item' + (index === 0 ? ' active' : '');
        div.id = `sidebar-item-${index}`;
        div.innerHTML = `<span class="frame-num">${numStr}</span> <span class="frame-title">${title}</span>`;
        div.onclick = () => jumpToFrame(index);
        sidebar.appendChild(div);
    });
}

function toggleSidebar() {
    document.getElementById('sidebar-container').classList.toggle('collapsed');
}

function changeFrame(dir) {
    currentFrame = Math.max(0, Math.min(frameTitles.length - 1, currentFrame + dir));
    updateUI();
}

function jumpToFrame(index) {
    currentFrame = index;
    updateUI();
}

function updateUI() {
    document.getElementById('backBtn').disabled = (currentFrame === 0);
    document.getElementById('nextBtn').disabled = (currentFrame === frameTitles.length - 1);
    
    // Update Sidebar highlighting
    document.querySelectorAll('.sidebar-item').forEach(item => item.classList.remove('active'));
    const activeItem = document.getElementById(`sidebar-item-${currentFrame}`);
    if(activeItem) activeItem.classList.add('active');

    // Update Title Overlay
    const titleOverlay = document.getElementById('frame-title-overlay');
    titleOverlay.classList.add('hidden');
    
    if (currentFrame > 0) {
        setTimeout(() => {
            titleOverlay.innerText = frameTitles[currentFrame];
            titleOverlay.classList.remove('hidden');
        }, 300);
    }

    closeOverlay();
    clearMarkers();

    const flyFast = { duration: 1.2, easeLinearity: 0.5 };

    switch(currentFrame) {
        case 0: if(highlightLayer) highlightLayer.addTo(map); map.flyTo(locs.nz.c, locs.nz.z, flyFast); break;
        case 1: if(highlightLayer) map.removeLayer(highlightLayer); map.flyTo(locs.ni.c, locs.ni.z, flyFast); addMarkers(anchors.main); break;
        case 2: map.flyTo(locs.akl_center.c, locs.akl_center.z, flyFast); addMarkers(anchors.akl_city); break;
        case 3: map.flyTo(locs.akl_culture.c, locs.akl_culture.z, flyFast); addMarkers(anchors.akl_culture); break;
        case 4: map.flyTo(locs.akl_coastal.c, locs.akl_coastal.z, flyFast); addMarkers(anchors.akl_coastal); break;
        case 5: map.flyTo(locs.central_region.c, locs.central_region.z, flyFast); addMarkers(anchors.central_region); break;
        case 6: map.flyTo(locs.rotorua_villages.c, locs.rotorua_villages.z, flyFast); addMarkers(anchors.rotorua_villages); break;
        case 7: map.flyTo(locs.rotorua_spas.c, locs.rotorua_spas.z, flyFast); addMarkers(anchors.rotorua_spas); break;
        case 8: map.flyTo(locs.rotorua_adventure.c, locs.rotorua_adventure.z, flyFast); addMarkers(anchors.rotorua_adventure); break;
        case 9: map.flyTo(locs.thermal_highway.c, locs.thermal_highway.z, flyFast); addMarkers(anchors.thermal_highway); break;
        case 10: map.flyTo(locs.taupo_region.c, locs.taupo_region.z, flyFast); addMarkers(anchors.taupo_details); break;
        case 11: map.flyTo(locs.tongariro_merged.c, locs.tongariro_merged.z, flyFast); addMarkers(anchors.tongariro_merged); break;
        case 12: map.flyTo(locs.transit_south.c, locs.transit_south.z, flyFast); addMarkers(anchors.transit_south); break;
        case 13: map.flyTo(locs.wellington_city.c, locs.wellington_city.z, flyFast); addMarkers(anchors.wellington_details); break;
        case 14: map.flyTo(locs.driving_routes.c, locs.driving_routes.z, flyFast); addMarkers(anchors.driving_routes); drawDrivingRoutes(['akl_to_hobbiton', 'akl_to_waitomo', 'akl_to_coromandel']); break;
        case 15: map.flyTo(locs.akl_ham.c, locs.akl_ham.z, flyFast); addMarkers(anchors.akl_ham); drawDrivingRoutes(['akl_to_hamilton']); break;
        case 16: map.flyTo(locs.ham_rot.c, locs.ham_rot.z, flyFast); addMarkers(anchors.ham_rot); drawDrivingRoutes(['hamilton_to_rotorua']); break;
        case 17: map.flyTo(locs.rot_tau.c, locs.rot_tau.z, flyFast); addMarkers(anchors.rot_tau); drawDrivingRoutes(['rotorua_to_taupo']); break;
        case 18: map.flyTo(locs.tau_ham.c, locs.tau_ham.z, flyFast); addMarkers(anchors.tau_ham); drawDrivingRoutes(['taupo_to_hamilton']); break;
        case 19: map.flyTo(locs.itinerary_recap.c, locs.itinerary_recap.z, flyFast); addMarkers(anchors.itinerary_recap); drawDrivingRoutes(['akl_to_hamilton', 'hamilton_to_rotorua', 'rotorua_to_taupo', 'taupo_to_hamilton']); break;
        case 20: map.flyTo(locs.full_tour.c, locs.full_tour.z, flyFast); addMarkers(anchors.full_tour); drawDrivingRoutes(['full_island_main', 'full_island_waitomo']); break;
    }
}

const categoryIcons = {
    city: `<svg viewBox="0 0 24 24"><path d="M15 11V5l-3-3-3 3v2H3v14h18V11h-6zm-8 8H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm6 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm6 12h-2v-2h2v2zm0-4h-2v-2h2v2z"/></svg>`,
    nature: `<svg viewBox="0 0 24 24"><path d="M14 6l-3.75 5 2.85 3.8-1.6 1.2C9.81 13.75 7 10 7 10l-6 8h22L14 6z"/></svg>`,
    beach: `<svg viewBox="0 0 24 24"><path d="M12 2a8 8 0 00-8 8h16a8 8 0 00-8-8z"/><path d="M12 10v9a2 2 0 01-2 2H9v-2h1a1 1 0 001-1v-8h2z"/><path d="M2 18c1.5-1 3-1 4.5 0s3 1 4.5 0 3-1 4.5 0 3 1 4.5 0v2c-1.5 1-3 1-4.5 0s-3-1-4.5 0-3 1-4.5 0-3-1-4.5 0v-2z" opacity="0.6"/></svg>`,
    spa: `<svg viewBox="0 0 24 24"><circle cx="12" cy="7" r="3"/><path d="M2 14c1.5-1 3-1 4.5 0s3 1 4.5 0 3-1 4.5 0 3-1 4.5 0v3c-1.5 1-3 1-4.5 0s-3-1-4.5 0-3 1-4.5 0-3-1-4.5 0v-3zM2 18c1.5-1 3-1 4.5 0s3 1 4.5 0 3-1 4.5 0 3-1 4.5 0v3c-1.5 1-3 1-4.5 0s-3-1-4.5 0-3 1-4.5 0-3-1-4.5 0v-3z"/></svg>`,
    culture: `<svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 8.19 8.63 1 9.24l5.46 4.73L4.82 21z"/></svg>`,
    adventure: `<svg viewBox="0 0 512 512"><path fill="currentColor" d="M434.115,239.04l-33.036-46.148c-8.024-10.894-18.451-19.779-30.478-25.988l-67.478-35.418c-15.591-6.356-26.846-11.578-43.15-12.33l-18.842-0.537c-11.675-0.196-23.536,3.475-31.689,11.841l-64.217,57.638l-55.627,15.258c-10.534,2.9-16.957,13.531-14.624,24.201l0.196,0.821c2.294,10.494,12.3,17.435,22.942,15.922l44.81-6.394c11.178-1.591,21.966-5.223,31.826-10.709l27.081-18.275l1.386,89.883c-0.274,7.234-0.43,12.173-3.466,17.455l-91.835,159.518c-6.561,11.374-2.685,25.9,8.649,32.51l0.791,0.459c10.729,6.257,24.455,3.241,31.562-6.932l104.908-148.37l40.182,87.94c3.105,4.09,6.863,7.634,11.129,10.485l80.189,53.704c10.094,6.765,23.722,4.617,31.259-4.93l0.899-1.152c3.856-4.892,5.584-11.12,4.822-17.31c-0.772-6.179-3.983-11.793-8.923-15.59l-69.158-53.138l-40.045-113.166l3.573-101.441l48.012,14.418l50.492,49.574c6.346,6.238,16.304,6.932,23.45,1.63l0.489-0.361C438.117,258.233,439.875,247.074,434.115,239.04z"/><path fill="currentColor" d="M239.735,99.221c27.227,4.169,52.688-14.536,56.867-41.773c4.158-27.237-14.546-52.698-41.784-56.867c-27.237-4.168-52.698,14.536-56.857,41.774C193.783,69.593,212.497,95.053,239.735,99.221z"/></svg>`,
    landmark: `<svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 8.19 8.63 1 9.24l5.46 4.73L4.82 21z"/></svg>`,
    shopping: `<svg viewBox="0 0 24 24"><path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12z"/></svg>`
};

function addMarkers(data) {
    const isDetailFrame = currentFrame > 1; // Frames after North Island Overview
    data.forEach(item => {
        const dotClass = `dot-${item.type || 'city'}`;
        const isRefCity = isDetailFrame && item.type === 'city';
        const referenceClass = isRefCity ? 'city-reference' : '';
        
        const iconSvg = categoryIcons[item.icon] || categoryIcons[item.type] || categoryIcons.city;
        const posClass = item.pos ? `pos-${item.pos}` : '';

        // Generate Drive Times Tooltip HTML
        let tooltipHtml = '';
        if (item.driveTimes && item.driveTimes.length > 0) {
            let shortestIndex = -1;
            if (item.driveTimes.length > 1) {
                const timesInMinutes = item.driveTimes.map(d => parseTimeToMinutes(d.time));
                const minTime = Math.min(...timesInMinutes);
                shortestIndex = timesInMinutes.indexOf(minTime);
            }

            const driveList = item.driveTimes.map((d, i) => {
                const highlightClass = (i === shortestIndex) ? 'shortest-route' : '';
                return `<div class="drive-item ${highlightClass}"><span class="drive-from">${d.from}</span> <span class="drive-time">${d.time}</span></div>`;
            }).join('');
            tooltipHtml = `<div class="minimalist-tooltip">${driveList}</div>`;
        }

        const customIcon = L.divIcon({
            className: 'custom-anchor-minimal',
            html: `<div class="minimalist-container ${posClass}" ${item.pos ? 'data-manual="true"' : ''}>
                     ${tooltipHtml}
                     <div class="minimalist-label ${referenceClass}" onclick="showCollage('${item.name}')">
                       <div class="minimalist-dot ${dotClass}">
                         ${iconSvg}
                       </div>
                       <span class="minimalist-text">${item.name}</span>
                     </div>
                     <div class="minimalist-line"></div>
                     <div class="minimalist-pin"></div>
                   </div>`,
            iconSize: [0, 0], iconAnchor: [0, 0]
        });
        markers.push(L.marker(item.c, { icon: customIcon }).addTo(map));
    });

    // Wait for the flyTo animation to finish before emerging labels
    map.once('moveend', () => {
        const containers = document.querySelectorAll('.minimalist-container');
        containers.forEach((container, index) => {
            setTimeout(() => {
                container.classList.add('visible');
                // Resolve collisions as each becomes visible to prevent sudden "jumps"
                autoResolveCollisions();
            }, index * 100); // Staggered reveal
        });
    });
}

function autoResolveCollisions() {
    const MARGIN = 12;
    const orientations = ['', 'pos-bottom', 'pos-right', 'pos-left'];
    const containers = Array.from(document.querySelectorAll('.minimalist-container'));
    
    // Reset all non-manual containers to default first
    containers.forEach(c => {
        if (!c.dataset.manual) {
            orientations.forEach(o => o && c.classList.remove(o));
        }
    });

    const rects = [];
    containers.forEach(container => {
        const label = container.querySelector('.minimalist-label');
        if (!label) return;

        let selectedOrientation = '';
        
        // If it's a manual override, check for collision but prefer it
        if (container.dataset.manual) {
            selectedOrientation = orientations.find(o => o && container.classList.contains(o)) || '';
        } else {
            // Try each orientation until one doesn't collide
            for (const orientation of orientations) {
                orientations.forEach(o => o && container.classList.remove(o));
                if (orientation) container.classList.add(orientation);

                const rect = label.getBoundingClientRect();
                const hasOverlap = rects.some(r => {
                    return !(rect.right + MARGIN < r.left || 
                             rect.left - MARGIN > r.right || 
                             rect.bottom + MARGIN < r.top || 
                             rect.top - MARGIN > r.bottom);
                });

                if (!hasOverlap) {
                    selectedOrientation = orientation;
                    break;
                }
            }
        }

        // Apply result
        orientations.forEach(o => o && container.classList.remove(o));
        if (selectedOrientation) container.classList.add(selectedOrientation);
        rects.push(label.getBoundingClientRect());
    });
}

function clearMarkers() { 
    markers.forEach(m => map.removeLayer(m)); 
    markers = []; 
    polylines.forEach(p => map.removeLayer(p));
    polylines = [];
}

function parseTimeToMinutes(str) {
    let total = 0;
    const hMatch = str.match(/(\d+(\.\d+)?)h/);
    const mMatch = str.match(/(\d+)m/);
    if (hMatch) total += parseFloat(hMatch[1]) * 60;
    if (mMatch) total += parseInt(mMatch[1]);
    return total || 9999; // Fallback for things like pure text
}

function drawDrivingRoutes(keys) {
    const routeColor = '#64748b'; // Slate Gray for a unified look

    keys.forEach(key => {
        if (!routes[key]) return;
        const poly = L.polyline(routes[key], {
            color: routeColor,
            weight: 3,
            opacity: 0.5,
            dashArray: '2, 12', // Dotted effect
            lineCap: 'round',
            lineJoin: 'round'
        }).addTo(map);
        polylines.push(poly);
    });
}

function showCollage(name) {
    document.getElementById('cinema-overlay').style.display = 'flex';
    document.getElementById('nav-container').classList.add('hidden');
    
    // Update Title Overlay to Place Name
    const titleOverlay = document.getElementById('frame-title-overlay');
    titleOverlay.innerText = name;
    titleOverlay.classList.add('detail-mode'); // Optional hook for styling

    document.getElementById('sidebar-container').classList.add('background-mode');
    
    console.log("Overlay active for: " + name);
}

function closeOverlay() {
    document.getElementById('cinema-overlay').style.display = 'none';
    document.getElementById('nav-container').classList.remove('hidden');

    // Restore Frame Title
    const titleOverlay = document.getElementById('frame-title-overlay');
    titleOverlay.innerText = frameTitles[currentFrame];
    titleOverlay.classList.remove('detail-mode');

    document.getElementById('sidebar-container').classList.remove('background-mode');
}

// Keyboard Support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeOverlay();
});

// Initial call
initSidebar();
updateUI();
