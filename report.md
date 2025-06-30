[link to repo]()

### Target Audience

The map is aimed at residents of Salzburg City. The interface and language are in German to reflect this. It’s not intended as a data tool, but as a visual showcase of road sign data in a form rarely seen.

---

### Data Sources

All road sign data comes from the open data portal [data.gv.at](https://data.gv.at), which provides official Austrian datasets. The data was in GeoJSON format and only lightly cleaned (sanitizing string data).

---

### Methodology

The selected signs were chosen based on how common they are and whether they might reveal interesting patterns:

- **Vorrang geben**: One of the most common signs.
- **Halten & Parken verboten**: High frequency, chosen to find out if there are areas with heavy parking restrictions.
- **Fußgängerübergang** Chosen to check if crossings increase closer to the city center, which they seem to do.
- **Stop**: Included for its recognizability and because it appears surprisingly rarely.
- **Zone 30**: Used to see whether 30 km/h zones form distinct clusters or areas.

Each set of coordinates was converted to a Leaflet heatmap layer. The UI was built to allow only one layer to be active at a time.

---

### Design Choices

- Replaced the default Leaflet layer control with custom sidebar buttons for simpler, clearer toggling.
- Adjusted the heatmap color scheme to green → yellow → red instead of the default blue → red, for more visual clarity and to mimic traffic signal colors.
- Restyled popups with dark backgrounds and light text for readability over map tiles.

---

### Analysis

- Yield signs cluster along roads. If zoomed in a little, lines are formed by the heat of the signs along roads
- No parking zones are more concentrated around the city center.
- Pedestrian crossings seem to become more frequent towards city center.
- Stop signs are few, mostly on 4 way crossings.

---

### Potential Improvements

- Add toggle between heatmap and point-marker view.
- Optimize for mobile.
- Add functionality to choose any road sign.
- Add more drawing options, instead of just rectangle for more accuracy.
- Improvements made after presentation
  - I added a display showing the amount of sign currently used for the active heatmap.
    This is supposed to help show the interesting parts about the data (e.g. the very few stop signs). This can also be achieved with the draw function but its not intuitive. The display is in the top right corner of the map with a blurred background for better readability.
  - I added a small pulsing animation to the info button to grab the users attention and show them that it exists. I could also just have the info screen open when accessing the site, but I like the less optrusive version with the animation better.

---

### Critical Reflection

Heatmaps are nice for pattern discovery but hide precise details.  
Only showing one layer at a time improves clarity but prevents side-by-side comparison.  
A checkbox-style toggle which merges the data might offer more flexibility.

---

### Key Takeaways

- General experience with leafletJS. Seems useful to create more specific maps instead of embedding google maps in a site.
- Heatmaps reveal distribution patterns but don’t reflect exact counts, hence the sign count interaction.
- Salzburg has surprisingly few stop signs.
