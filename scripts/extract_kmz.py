import zipfile
import xml.etree.ElementTree as ET
import sys
import os

def extract_kmz(kmz_path):
    """Extracts coordinates from a KMZ file and prints them as JavaScript arrays."""
    if not os.path.exists(kmz_path):
        print(f"Error: File {kmz_path} not found.")
        return

    # KMZ is a zip file containing doc.kml
    with zipfile.ZipFile(kmz_path, 'r') as z:
        kml_content = z.read('doc.kml')

    root = ET.fromstring(kml_content)
    # KML uses namespaces, we need to handle them
    ns = {'kml': 'http://www.opengis.net/kml/2.2'}

    print("// --- Extracted Routes ---")
    for placemark in root.findall('.//kml:Placemark', ns):
        name = placemark.find('kml:name', ns)
        name_text = name.text if name is not None else "Unnamed Route"
        
        coords_element = placemark.find('.//kml:coordinates', ns)
        if coords_element is not None:
            raw_coords = coords_element.text.strip().split()
            path = []
            for c in raw_coords:
                parts = c.split(',')
                if len(parts) >= 2:
                    # KML is [lng, lat], Leaflet is [lat, lng]
                    path.append([round(float(parts[1]), 5), round(float(parts[0]), 5)])
            
            if path:
                var_name = name_text.lower().replace(' ', '_').replace('-', '_')
                print(f"{var_name}: {path},")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 extract_kmz.py path/to/your/file.kmz")
    else:
        extract_kmz(sys.argv[1])
