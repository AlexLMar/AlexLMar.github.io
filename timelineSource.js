var options = {
      font: 'lustria-lato',
      scale_factor: 0.5,
      timenav_position: "top"
  }
  // The TL.Timeline constructor takes at least two arguments:
  // the id of the Timeline container (no '#'), and
  // the URL to your JSON data file or Google spreadsheet.
  // the id must refer to an element "above" this code,
  // and the element must have CSS styling to give it width and height
  // optionally, a third argument with configuration options can be passed.
  // See below for more about options.
  timeline = new TL.Timeline('timeline-embed', filteredDataCopy, options);

  // make_the_json() is some javascript function you've written
  // which creates the appropriate JSON configuration