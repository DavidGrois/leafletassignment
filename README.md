## README

The code is based on the code provided in the first leaflet lecture. Map instancing and basemap loading is the same. Then the code separates the data into groups based on road sign IDs. These groups are used to make the heatmap layers.

The layer containing all data gets displayed as default. The sign images on the right side of the site function as buttons to switch layers. This functionality is created by looping over the buttons and assigning onclick listeners, which first remove all active layers and then activate the clicked one.

An outline of the city salzburg is also added to give users a familiar shape/indicator for orientation.

The functionality to draw a rectangle on the map is added with leaflet.draw. After drawing a rectangle, the coordinates of the bounds of the rectangle are matched with coordinates of the datapoints of the active layer to count how many signs are inside the rectangle. Then a popup is added to inform the user of the number of signs.

more detail can be found in the comments of the code.


### How to start

I used the [live server VSCode extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) during development. Opening the index.html file with a browser also works, but it can happen that the basemap has missing authentication when the calls are not coming from a server.
