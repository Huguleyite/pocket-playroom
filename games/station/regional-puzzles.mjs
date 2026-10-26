// Fixed, curated and exhaustively verified puzzle records.
export const regionalPuzzles=[
  {
    "region": 1,
    "title": "Ridge runners",
    "intro": "Restore the pine highlands network. Every community needs a route home.",
    "difficulty": "Thoughtful",
    "nodes": [
      {
        "name": "Summit HQ",
        "need": 2,
        "x": 14,
        "y": 17,
        "backup": false
      },
      {
        "name": "Fir Lookout",
        "need": 2,
        "x": 50,
        "y": 14,
        "backup": false
      },
      {
        "name": "Old Mill",
        "need": 1,
        "x": 86,
        "y": 18,
        "backup": false
      },
      {
        "name": "Birch Lodge",
        "need": 3,
        "x": 14,
        "y": 48,
        "backup": false
      },
      {
        "name": "High Pass",
        "need": 2,
        "x": 50,
        "y": 46,
        "backup": false
      },
      {
        "name": "Ranger Hut",
        "need": 1,
        "x": 86,
        "y": 48,
        "backup": false
      },
      {
        "name": "Cedar Vale",
        "need": 1,
        "x": 14,
        "y": 78,
        "backup": false
      }
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        3,
        4
      ],
      [
        4,
        5
      ],
      [
        0,
        3
      ],
      [
        3,
        6
      ],
      [
        1,
        4
      ],
      [
        2,
        5
      ],
      [
        1,
        3
      ],
      [
        1,
        5
      ]
    ],
    "walkthrough": "Summit HQ needs 2 more connections, with exactly 2 available. Each is required. Connect Summit HQ–Fir Lookout.\n\nSummit HQ needs 1 more connection, with exactly 1 available. Each is required. Connect Summit HQ–Birch Lodge.\n\nCedar Vale needs 1 more connection, with exactly 1 available. Each is required. Connect Birch Lodge–Cedar Vale.\n\nFir Lookout ↔ Old Mill must connect. The opposite choice, followed through the station counts, cuts Old Mill off from HQ. Connect Fir Lookout–Old Mill.\n\nFir Lookout already has all its connections. Its remaining links can be ruled out. Rule out Fir Lookout–High Pass.\n\nFir Lookout already has all its connections. Its remaining links can be ruled out. Rule out Fir Lookout–Birch Lodge.\n\nFir Lookout already has all its connections. Its remaining links can be ruled out. Rule out Fir Lookout–Ranger Hut.\n\nOld Mill already has all its connections. Its remaining links can be ruled out. Rule out Old Mill–Ranger Hut.\n\nBirch Lodge needs 1 more connection, with exactly 1 available. Each is required. Connect Birch Lodge–High Pass.\n\nHigh Pass needs 1 more connection, with exactly 1 available. Each is required. Connect High Pass–Ranger Hut.",
    "reasoningSteps": 1
  },
  {
    "region": 1,
    "title": "Above the canopy",
    "intro": "Restore the pine highlands network. Every community needs a route home.",
    "difficulty": "Thoughtful",
    "nodes": [
      {
        "name": "Summit HQ",
        "need": 2,
        "x": 14,
        "y": 17,
        "backup": false
      },
      {
        "name": "Fir Lookout",
        "need": 2,
        "x": 50,
        "y": 14,
        "backup": false
      },
      {
        "name": "Old Mill",
        "need": 1,
        "x": 86,
        "y": 18,
        "backup": false
      },
      {
        "name": "Birch Lodge",
        "need": 3,
        "x": 14,
        "y": 48,
        "backup": false
      },
      {
        "name": "High Pass",
        "need": 2,
        "x": 50,
        "y": 46,
        "backup": false
      },
      {
        "name": "Ranger Hut",
        "need": 1,
        "x": 86,
        "y": 48,
        "backup": false
      },
      {
        "name": "Cedar Vale",
        "need": 1,
        "x": 14,
        "y": 78,
        "backup": false
      }
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        3,
        4
      ],
      [
        4,
        5
      ],
      [
        0,
        3
      ],
      [
        3,
        6
      ],
      [
        1,
        4
      ],
      [
        2,
        5
      ],
      [
        1,
        5
      ]
    ],
    "walkthrough": "Summit HQ needs 2 more connections, with exactly 2 available. Each is required. Connect Summit HQ–Fir Lookout.\n\nSummit HQ needs 1 more connection, with exactly 1 available. Each is required. Connect Summit HQ–Birch Lodge.\n\nBirch Lodge needs 2 more connections, with exactly 2 available. Each is required. Connect Birch Lodge–High Pass.\n\nBirch Lodge needs 1 more connection, with exactly 1 available. Each is required. Connect Birch Lodge–Cedar Vale.\n\nFir Lookout ↔ Old Mill must connect. The opposite choice, followed through the station counts, cuts Old Mill off from HQ. Connect Fir Lookout–Old Mill.\n\nFir Lookout already has all its connections. Its remaining links can be ruled out. Rule out Fir Lookout–High Pass.\n\nFir Lookout already has all its connections. Its remaining links can be ruled out. Rule out Fir Lookout–Ranger Hut.\n\nOld Mill already has all its connections. Its remaining links can be ruled out. Rule out Old Mill–Ranger Hut.\n\nHigh Pass needs 1 more connection, with exactly 1 available. Each is required. Connect High Pass–Ranger Hut.",
    "reasoningSteps": 1
  },
  {
    "region": 1,
    "title": "The old mill",
    "intro": "Restore the pine highlands network. Every community needs a route home.",
    "difficulty": "Thoughtful",
    "nodes": [
      {
        "name": "Summit HQ",
        "need": 3,
        "x": 14,
        "y": 17,
        "backup": false
      },
      {
        "name": "Fir Lookout",
        "need": 2,
        "x": 50,
        "y": 14,
        "backup": false
      },
      {
        "name": "Old Mill",
        "need": 1,
        "x": 86,
        "y": 18,
        "backup": false
      },
      {
        "name": "Birch Lodge",
        "need": 2,
        "x": 14,
        "y": 48,
        "backup": false
      },
      {
        "name": "High Pass",
        "need": 2,
        "x": 50,
        "y": 46,
        "backup": false
      },
      {
        "name": "Ranger Hut",
        "need": 1,
        "x": 86,
        "y": 48,
        "backup": false
      },
      {
        "name": "Cedar Vale",
        "need": 1,
        "x": 14,
        "y": 78,
        "backup": false
      }
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        3,
        4
      ],
      [
        4,
        5
      ],
      [
        0,
        3
      ],
      [
        3,
        6
      ],
      [
        1,
        4
      ],
      [
        2,
        5
      ],
      [
        0,
        4
      ]
    ],
    "walkthrough": "Summit HQ needs 3 more connections, with exactly 3 available. Each is required. Connect Summit HQ–Fir Lookout.\n\nSummit HQ needs 2 more connections, with exactly 2 available. Each is required. Connect Summit HQ–Birch Lodge.\n\nSummit HQ needs 1 more connection, with exactly 1 available. Each is required. Connect Summit HQ–High Pass.\n\nCedar Vale needs 1 more connection, with exactly 1 available. Each is required. Connect Birch Lodge–Cedar Vale.\n\nBirch Lodge already has all its connections. Its remaining links can be ruled out. Rule out Birch Lodge–High Pass.\n\nFir Lookout ↔ Old Mill must connect. The opposite choice, followed through the station counts, cuts Old Mill off from HQ. Connect Fir Lookout–Old Mill.\n\nFir Lookout already has all its connections. Its remaining links can be ruled out. Rule out Fir Lookout–High Pass.\n\nOld Mill already has all its connections. Its remaining links can be ruled out. Rule out Old Mill–Ranger Hut.\n\nHigh Pass needs 1 more connection, with exactly 1 available. Each is required. Connect High Pass–Ranger Hut.",
    "reasoningSteps": 1
  },
  {
    "region": 1,
    "title": "Through the pass",
    "intro": "Restore the pine highlands network. Every community needs a route home.",
    "difficulty": "Thoughtful",
    "nodes": [
      {
        "name": "Summit HQ",
        "need": 2,
        "x": 14,
        "y": 17,
        "backup": false
      },
      {
        "name": "Fir Lookout",
        "need": 2,
        "x": 50,
        "y": 14,
        "backup": false
      },
      {
        "name": "Old Mill",
        "need": 1,
        "x": 86,
        "y": 18,
        "backup": false
      },
      {
        "name": "Birch Lodge",
        "need": 3,
        "x": 14,
        "y": 48,
        "backup": false
      },
      {
        "name": "High Pass",
        "need": 2,
        "x": 50,
        "y": 46,
        "backup": false
      },
      {
        "name": "Ranger Hut",
        "need": 1,
        "x": 86,
        "y": 48,
        "backup": false
      },
      {
        "name": "Cedar Vale",
        "need": 1,
        "x": 14,
        "y": 78,
        "backup": false
      }
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        3,
        4
      ],
      [
        4,
        5
      ],
      [
        0,
        3
      ],
      [
        3,
        6
      ],
      [
        1,
        4
      ],
      [
        2,
        5
      ],
      [
        2,
        4
      ]
    ],
    "walkthrough": "Summit HQ needs 2 more connections, with exactly 2 available. Each is required. Connect Summit HQ–Fir Lookout.\n\nSummit HQ needs 1 more connection, with exactly 1 available. Each is required. Connect Summit HQ–Birch Lodge.\n\nBirch Lodge needs 2 more connections, with exactly 2 available. Each is required. Connect Birch Lodge–High Pass.\n\nBirch Lodge needs 1 more connection, with exactly 1 available. Each is required. Connect Birch Lodge–Cedar Vale.\n\nFir Lookout ↔ Old Mill must connect. The opposite choice, followed through the station counts, cuts Old Mill off from HQ. Connect Fir Lookout–Old Mill.\n\nFir Lookout already has all its connections. Its remaining links can be ruled out. Rule out Fir Lookout–High Pass.\n\nOld Mill already has all its connections. Its remaining links can be ruled out. Rule out Old Mill–Ranger Hut.\n\nOld Mill already has all its connections. Its remaining links can be ruled out. Rule out Old Mill–High Pass.\n\nHigh Pass needs 1 more connection, with exactly 1 available. Each is required. Connect High Pass–Ranger Hut.",
    "reasoningSteps": 1
  },
  {
    "region": 1,
    "title": "Cedar connections",
    "intro": "Fir Lookout needs backup. Keep it connected if any single link fails.",
    "difficulty": "Challenging",
    "nodes": [
      {
        "name": "Summit HQ",
        "need": 2,
        "x": 14,
        "y": 17,
        "backup": false
      },
      {
        "name": "Fir Lookout",
        "need": 3,
        "x": 50,
        "y": 14,
        "backup": true
      },
      {
        "name": "Old Mill",
        "need": 2,
        "x": 86,
        "y": 18,
        "backup": false
      },
      {
        "name": "Birch Lodge",
        "need": 2,
        "x": 14,
        "y": 48,
        "backup": false
      },
      {
        "name": "High Pass",
        "need": 3,
        "x": 50,
        "y": 46,
        "backup": false
      },
      {
        "name": "Ranger Hut",
        "need": 2,
        "x": 86,
        "y": 48,
        "backup": false
      },
      {
        "name": "Cedar Vale",
        "need": 2,
        "x": 14,
        "y": 78,
        "backup": false
      },
      {
        "name": "Trail End",
        "need": 2,
        "x": 50,
        "y": 78,
        "backup": false
      }
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        3,
        4
      ],
      [
        4,
        5
      ],
      [
        6,
        7
      ],
      [
        0,
        3
      ],
      [
        3,
        6
      ],
      [
        1,
        4
      ],
      [
        4,
        7
      ],
      [
        2,
        5
      ],
      [
        0,
        4
      ],
      [
        1,
        5
      ]
    ],
    "walkthrough": "Old Mill needs 2 more connections, with exactly 2 available. Each is required. Connect Fir Lookout–Old Mill.\n\nOld Mill needs 1 more connection, with exactly 1 available. Each is required. Connect Old Mill–Ranger Hut.\n\nCedar Vale needs 2 more connections, with exactly 2 available. Each is required. Connect Cedar Vale–Trail End.\n\nCedar Vale needs 1 more connection, with exactly 1 available. Each is required. Connect Birch Lodge–Cedar Vale.\n\nTrail End needs 1 more connection, with exactly 1 available. Each is required. Connect High Pass–Trail End.\n\nSummit HQ ↔ Fir Lookout must connect. The opposite choice forces Fir Lookout behind a single vulnerable link. A backup route must survive any one link failing. Connect Summit HQ–Fir Lookout.\n\nBirch Lodge ↔ High Pass must stay inactive. The opposite choice forces Fir Lookout behind a single vulnerable link. A backup route must survive any one link failing. Rule out Birch Lodge–High Pass.\n\nBirch Lodge needs 1 more connection, with exactly 1 available. Each is required. Connect Summit HQ–Birch Lodge.\n\nSummit HQ already has all its connections. Its remaining links can be ruled out. Rule out Summit HQ–High Pass.\n\nHigh Pass needs 2 more connections, with exactly 2 available. Each is required. Connect High Pass–Ranger Hut.\n\nHigh Pass needs 1 more connection, with exactly 1 available. Each is required. Connect Fir Lookout–High Pass.",
    "reasoningSteps": 2
  },
  {
    "region": 1,
    "title": "Far from the trail",
    "intro": "High Pass needs backup. Keep it connected if any single link fails.",
    "difficulty": "Challenging",
    "nodes": [
      {
        "name": "Summit HQ",
        "need": 2,
        "x": 14,
        "y": 17,
        "backup": false
      },
      {
        "name": "Fir Lookout",
        "need": 3,
        "x": 50,
        "y": 14,
        "backup": false
      },
      {
        "name": "Old Mill",
        "need": 2,
        "x": 86,
        "y": 18,
        "backup": false
      },
      {
        "name": "Birch Lodge",
        "need": 3,
        "x": 14,
        "y": 48,
        "backup": false
      },
      {
        "name": "High Pass",
        "need": 3,
        "x": 50,
        "y": 46,
        "backup": true
      },
      {
        "name": "Ranger Hut",
        "need": 1,
        "x": 86,
        "y": 48,
        "backup": false
      },
      {
        "name": "Cedar Vale",
        "need": 2,
        "x": 14,
        "y": 78,
        "backup": false
      },
      {
        "name": "Trail End",
        "need": 2,
        "x": 50,
        "y": 78,
        "backup": false
      }
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        3,
        4
      ],
      [
        4,
        5
      ],
      [
        6,
        7
      ],
      [
        0,
        3
      ],
      [
        3,
        6
      ],
      [
        1,
        4
      ],
      [
        4,
        7
      ],
      [
        2,
        5
      ],
      [
        1,
        3
      ],
      [
        4,
        6
      ]
    ],
    "walkthrough": "Summit HQ needs 2 more connections, with exactly 2 available. Each is required. Connect Summit HQ–Fir Lookout.\n\nSummit HQ needs 1 more connection, with exactly 1 available. Each is required. Connect Summit HQ–Birch Lodge.\n\nOld Mill needs 2 more connections, with exactly 2 available. Each is required. Connect Fir Lookout–Old Mill.\n\nOld Mill needs 1 more connection, with exactly 1 available. Each is required. Connect Old Mill–Ranger Hut.\n\nRanger Hut already has all its connections. Its remaining links can be ruled out. Rule out High Pass–Ranger Hut.\n\nTrail End needs 2 more connections, with exactly 2 available. Each is required. Connect Cedar Vale–Trail End.\n\nTrail End needs 1 more connection, with exactly 1 available. Each is required. Connect High Pass–Trail End.\n\nBirch Lodge ↔ High Pass must connect. The opposite choice forces High Pass behind a single vulnerable link. A backup route must survive any one link failing. Connect Birch Lodge–High Pass.\n\nBirch Lodge ↔ Cedar Vale must connect. The opposite choice forces High Pass behind a single vulnerable link. A backup route must survive any one link failing. Connect Birch Lodge–Cedar Vale.\n\nBirch Lodge already has all its connections. Its remaining links can be ruled out. Rule out Fir Lookout–Birch Lodge.\n\nFir Lookout needs 1 more connection, with exactly 1 available. Each is required. Connect Fir Lookout–High Pass.",
    "reasoningSteps": 2
  },
  {
    "region": 1,
    "title": "Ranger relay",
    "intro": "Old Mill needs backup. Keep it connected if any single link fails.",
    "difficulty": "Challenging",
    "nodes": [
      {
        "name": "Summit HQ",
        "need": 2,
        "x": 14,
        "y": 17,
        "backup": false
      },
      {
        "name": "Fir Lookout",
        "need": 2,
        "x": 50,
        "y": 14,
        "backup": false
      },
      {
        "name": "Old Mill",
        "need": 2,
        "x": 86,
        "y": 18,
        "backup": true
      },
      {
        "name": "Birch Lodge",
        "need": 3,
        "x": 14,
        "y": 48,
        "backup": false
      },
      {
        "name": "High Pass",
        "need": 3,
        "x": 50,
        "y": 46,
        "backup": false
      },
      {
        "name": "Ranger Hut",
        "need": 1,
        "x": 86,
        "y": 48,
        "backup": false
      },
      {
        "name": "Cedar Vale",
        "need": 2,
        "x": 14,
        "y": 78,
        "backup": false
      },
      {
        "name": "Trail End",
        "need": 1,
        "x": 50,
        "y": 78,
        "backup": false
      }
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        3,
        4
      ],
      [
        4,
        5
      ],
      [
        6,
        7
      ],
      [
        0,
        3
      ],
      [
        3,
        6
      ],
      [
        1,
        4
      ],
      [
        4,
        7
      ],
      [
        2,
        5
      ],
      [
        2,
        4
      ],
      [
        4,
        6
      ]
    ],
    "walkthrough": "Summit HQ needs 2 more connections, with exactly 2 available. Each is required. Connect Summit HQ–Fir Lookout.\n\nSummit HQ needs 1 more connection, with exactly 1 available. Each is required. Connect Summit HQ–Birch Lodge.\n\nBirch Lodge needs 2 more connections, with exactly 2 available. Each is required. Connect Birch Lodge–High Pass.\n\nBirch Lodge needs 1 more connection, with exactly 1 available. Each is required. Connect Birch Lodge–Cedar Vale.\n\nFir Lookout ↔ Old Mill must connect. The opposite choice forces Old Mill behind a single vulnerable link. A backup route must survive any one link failing. Connect Fir Lookout–Old Mill.\n\nFir Lookout already has all its connections. Its remaining links can be ruled out. Rule out Fir Lookout–High Pass.\n\nHigh Pass ↔ Ranger Hut must connect. The opposite choice forces Old Mill behind a single vulnerable link. A backup route must survive any one link failing. Connect High Pass–Ranger Hut.\n\nRanger Hut already has all its connections. Its remaining links can be ruled out. Rule out Old Mill–Ranger Hut.\n\nOld Mill needs 1 more connection, with exactly 1 available. Each is required. Connect Old Mill–High Pass.\n\nHigh Pass already has all its connections. Its remaining links can be ruled out. Rule out High Pass–Trail End.\n\nHigh Pass already has all its connections. Its remaining links can be ruled out. Rule out High Pass–Cedar Vale.\n\nCedar Vale needs 1 more connection, with exactly 1 available. Each is required. Connect Cedar Vale–Trail End.",
    "reasoningSteps": 2
  },
  {
    "region": 1,
    "title": "Summit dispatch",
    "intro": "Fir Lookout needs backup. Keep it connected if any single link fails.",
    "difficulty": "Challenging",
    "nodes": [
      {
        "name": "Summit HQ",
        "need": 2,
        "x": 14,
        "y": 17,
        "backup": false
      },
      {
        "name": "Fir Lookout",
        "need": 2,
        "x": 50,
        "y": 14,
        "backup": true
      },
      {
        "name": "Old Mill",
        "need": 1,
        "x": 86,
        "y": 18,
        "backup": false
      },
      {
        "name": "Birch Lodge",
        "need": 3,
        "x": 14,
        "y": 48,
        "backup": false
      },
      {
        "name": "High Pass",
        "need": 3,
        "x": 50,
        "y": 46,
        "backup": false
      },
      {
        "name": "Ranger Hut",
        "need": 1,
        "x": 86,
        "y": 48,
        "backup": false
      },
      {
        "name": "Cedar Vale",
        "need": 2,
        "x": 14,
        "y": 78,
        "backup": false
      },
      {
        "name": "Trail End",
        "need": 2,
        "x": 50,
        "y": 78,
        "backup": false
      }
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        3,
        4
      ],
      [
        4,
        5
      ],
      [
        6,
        7
      ],
      [
        0,
        3
      ],
      [
        3,
        6
      ],
      [
        1,
        4
      ],
      [
        4,
        7
      ],
      [
        2,
        5
      ],
      [
        1,
        3
      ],
      [
        2,
        4
      ]
    ],
    "walkthrough": "Summit HQ needs 2 more connections, with exactly 2 available. Each is required. Connect Summit HQ–Fir Lookout.\n\nSummit HQ needs 1 more connection, with exactly 1 available. Each is required. Connect Summit HQ–Birch Lodge.\n\nCedar Vale needs 2 more connections, with exactly 2 available. Each is required. Connect Cedar Vale–Trail End.\n\nCedar Vale needs 1 more connection, with exactly 1 available. Each is required. Connect Birch Lodge–Cedar Vale.\n\nTrail End needs 1 more connection, with exactly 1 available. Each is required. Connect High Pass–Trail End.\n\nFir Lookout ↔ Old Mill must stay inactive. The opposite choice forces Fir Lookout behind a single vulnerable link. A backup route must survive any one link failing. Rule out Fir Lookout–Old Mill.\n\nBirch Lodge ↔ High Pass must stay inactive. The opposite choice, followed through the station counts, cuts Old Mill off from HQ. Rule out Birch Lodge–High Pass.\n\nBirch Lodge needs 1 more connection, with exactly 1 available. Each is required. Connect Fir Lookout–Birch Lodge.\n\nFir Lookout already has all its connections. Its remaining links can be ruled out. Rule out Fir Lookout–High Pass.\n\nHigh Pass needs 2 more connections, with exactly 2 available. Each is required. Connect High Pass–Ranger Hut.\n\nHigh Pass needs 1 more connection, with exactly 1 available. Each is required. Connect Old Mill–High Pass.",
    "reasoningSteps": 2
  },
  {
    "region": 2,
    "title": "Reed and reason",
    "intro": "Restore the riverlands network. Every community needs a route home.",
    "difficulty": "Challenging",
    "nodes": [
      {
        "name": "Delta HQ",
        "need": 2,
        "x": 14,
        "y": 17,
        "backup": false
      },
      {
        "name": "Reed Bank",
        "need": 3,
        "x": 50,
        "y": 14,
        "backup": false
      },
      {
        "name": "East Weir",
        "need": 1,
        "x": 86,
        "y": 18,
        "backup": false
      },
      {
        "name": "Lock House",
        "need": 2,
        "x": 14,
        "y": 48,
        "backup": false
      },
      {
        "name": "Willow Bend",
        "need": 2,
        "x": 50,
        "y": 46,
        "backup": false
      },
      {
        "name": "Water Mill",
        "need": 1,
        "x": 86,
        "y": 48,
        "backup": false
      },
      {
        "name": "South Jetty",
        "need": 2,
        "x": 14,
        "y": 78,
        "backup": false
      },
      {
        "name": "West Ferry",
        "need": 2,
        "x": 50,
        "y": 78,
        "backup": false
      },
      {
        "name": "River Watch",
        "need": 1,
        "x": 86,
        "y": 78,
        "backup": false
      }
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        3,
        4
      ],
      [
        4,
        5
      ],
      [
        6,
        7
      ],
      [
        7,
        8
      ],
      [
        0,
        3
      ],
      [
        3,
        6
      ],
      [
        1,
        4
      ],
      [
        4,
        7
      ],
      [
        2,
        5
      ],
      [
        5,
        8
      ],
      [
        0,
        4
      ],
      [
        3,
        7
      ],
      [
        5,
        7
      ]
    ],
    "walkthrough": "Reed Bank needs 3 more connections, with exactly 3 available. Each is required. Connect Delta HQ–Reed Bank.\n\nReed Bank needs 2 more connections, with exactly 2 available. Each is required. Connect Reed Bank–East Weir.\n\nReed Bank needs 1 more connection, with exactly 1 available. Each is required. Connect Reed Bank–Willow Bend.\n\nEast Weir already has all its connections. Its remaining links can be ruled out. Rule out East Weir–Water Mill.\n\nSouth Jetty needs 2 more connections, with exactly 2 available. Each is required. Connect South Jetty–West Ferry.\n\nSouth Jetty needs 1 more connection, with exactly 1 available. Each is required. Connect Lock House–South Jetty.\n\nLock House ↔ Willow Bend must stay inactive. The opposite choice forces Willow Bend to exceed its count. Rule out Lock House–Willow Bend.\n\nWillow Bend ↔ Water Mill must connect. Following the opposite choice through every remaining count leaves no network that reaches HQ with the required backup routes. Connect Willow Bend–Water Mill.\n\nWillow Bend already has all its connections. Its remaining links can be ruled out. Rule out Willow Bend–West Ferry.\n\nWillow Bend already has all its connections. Its remaining links can be ruled out. Rule out Delta HQ–Willow Bend.\n\nDelta HQ needs 1 more connection, with exactly 1 available. Each is required. Connect Delta HQ–Lock House.\n\nLock House already has all its connections. Its remaining links can be ruled out. Rule out Lock House–West Ferry.\n\nWater Mill already has all its connections. Its remaining links can be ruled out. Rule out Water Mill–River Watch.\n\nWater Mill already has all its connections. Its remaining links can be ruled out. Rule out Water Mill–West Ferry.\n\nWest Ferry needs 1 more connection, with exactly 1 available. Each is required. Connect West Ferry–River Watch.",
    "reasoningSteps": 2
  },
  {
    "region": 2,
    "title": "Across the locks",
    "intro": "Restore the riverlands network. Every community needs a route home.",
    "difficulty": "Challenging",
    "nodes": [
      {
        "name": "Delta HQ",
        "need": 2,
        "x": 14,
        "y": 17,
        "backup": false
      },
      {
        "name": "Reed Bank",
        "need": 3,
        "x": 50,
        "y": 14,
        "backup": false
      },
      {
        "name": "East Weir",
        "need": 1,
        "x": 86,
        "y": 18,
        "backup": false
      },
      {
        "name": "Lock House",
        "need": 2,
        "x": 14,
        "y": 48,
        "backup": false
      },
      {
        "name": "Willow Bend",
        "need": 2,
        "x": 50,
        "y": 46,
        "backup": false
      },
      {
        "name": "Water Mill",
        "need": 1,
        "x": 86,
        "y": 48,
        "backup": false
      },
      {
        "name": "South Jetty",
        "need": 2,
        "x": 14,
        "y": 78,
        "backup": false
      },
      {
        "name": "West Ferry",
        "need": 2,
        "x": 50,
        "y": 78,
        "backup": false
      },
      {
        "name": "River Watch",
        "need": 1,
        "x": 86,
        "y": 78,
        "backup": false
      }
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        3,
        4
      ],
      [
        4,
        5
      ],
      [
        6,
        7
      ],
      [
        7,
        8
      ],
      [
        0,
        3
      ],
      [
        3,
        6
      ],
      [
        1,
        4
      ],
      [
        4,
        7
      ],
      [
        2,
        5
      ],
      [
        5,
        8
      ],
      [
        0,
        4
      ],
      [
        2,
        4
      ],
      [
        5,
        7
      ]
    ],
    "walkthrough": "Reed Bank needs 3 more connections, with exactly 3 available. Each is required. Connect Delta HQ–Reed Bank.\n\nReed Bank needs 2 more connections, with exactly 2 available. Each is required. Connect Reed Bank–East Weir.\n\nReed Bank needs 1 more connection, with exactly 1 available. Each is required. Connect Reed Bank–Willow Bend.\n\nEast Weir already has all its connections. Its remaining links can be ruled out. Rule out East Weir–Water Mill.\n\nEast Weir already has all its connections. Its remaining links can be ruled out. Rule out East Weir–Willow Bend.\n\nSouth Jetty needs 2 more connections, with exactly 2 available. Each is required. Connect South Jetty–West Ferry.\n\nSouth Jetty needs 1 more connection, with exactly 1 available. Each is required. Connect Lock House–South Jetty.\n\nLock House ↔ Willow Bend must stay inactive. The opposite choice forces Willow Bend to exceed its count. Rule out Lock House–Willow Bend.\n\nLock House needs 1 more connection, with exactly 1 available. Each is required. Connect Delta HQ–Lock House.\n\nDelta HQ already has all its connections. Its remaining links can be ruled out. Rule out Delta HQ–Willow Bend.\n\nWillow Bend ↔ Water Mill must connect. The opposite choice, followed through the station counts, cuts Water Mill off from HQ. Connect Willow Bend–Water Mill.\n\nWillow Bend already has all its connections. Its remaining links can be ruled out. Rule out Willow Bend–West Ferry.\n\nWater Mill already has all its connections. Its remaining links can be ruled out. Rule out Water Mill–River Watch.\n\nWater Mill already has all its connections. Its remaining links can be ruled out. Rule out Water Mill–West Ferry.\n\nWest Ferry needs 1 more connection, with exactly 1 available. Each is required. Connect West Ferry–River Watch.",
    "reasoningSteps": 2
  },
  {
    "region": 2,
    "title": "Willow crossing",
    "intro": "Restore the riverlands network. Every community needs a route home.",
    "difficulty": "Challenging",
    "nodes": [
      {
        "name": "Delta HQ",
        "need": 2,
        "x": 14,
        "y": 17,
        "backup": false
      },
      {
        "name": "Reed Bank",
        "need": 1,
        "x": 50,
        "y": 14,
        "backup": false
      },
      {
        "name": "East Weir",
        "need": 1,
        "x": 86,
        "y": 18,
        "backup": false
      },
      {
        "name": "Lock House",
        "need": 3,
        "x": 14,
        "y": 48,
        "backup": false
      },
      {
        "name": "Willow Bend",
        "need": 2,
        "x": 50,
        "y": 46,
        "backup": false
      },
      {
        "name": "Water Mill",
        "need": 2,
        "x": 86,
        "y": 48,
        "backup": false
      },
      {
        "name": "South Jetty",
        "need": 2,
        "x": 14,
        "y": 78,
        "backup": false
      },
      {
        "name": "West Ferry",
        "need": 2,
        "x": 50,
        "y": 78,
        "backup": false
      },
      {
        "name": "River Watch",
        "need": 1,
        "x": 86,
        "y": 78,
        "backup": false
      }
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        3,
        4
      ],
      [
        4,
        5
      ],
      [
        6,
        7
      ],
      [
        7,
        8
      ],
      [
        0,
        3
      ],
      [
        3,
        6
      ],
      [
        1,
        4
      ],
      [
        4,
        7
      ],
      [
        2,
        5
      ],
      [
        5,
        8
      ],
      [
        1,
        3
      ],
      [
        3,
        7
      ],
      [
        5,
        7
      ]
    ],
    "walkthrough": "Delta HQ needs 2 more connections, with exactly 2 available. Each is required. Connect Delta HQ–Reed Bank.\n\nDelta HQ needs 1 more connection, with exactly 1 available. Each is required. Connect Delta HQ–Lock House.\n\nReed Bank already has all its connections. Its remaining links can be ruled out. Rule out Reed Bank–East Weir.\n\nReed Bank already has all its connections. Its remaining links can be ruled out. Rule out Reed Bank–Willow Bend.\n\nReed Bank already has all its connections. Its remaining links can be ruled out. Rule out Reed Bank–Lock House.\n\nEast Weir needs 1 more connection, with exactly 1 available. Each is required. Connect East Weir–Water Mill.\n\nSouth Jetty needs 2 more connections, with exactly 2 available. Each is required. Connect South Jetty–West Ferry.\n\nSouth Jetty needs 1 more connection, with exactly 1 available. Each is required. Connect Lock House–South Jetty.\n\nLock House ↔ Willow Bend must connect. The opposite choice forces West Ferry to exceed its count. Connect Lock House–Willow Bend.\n\nLock House already has all its connections. Its remaining links can be ruled out. Rule out Lock House–West Ferry.\n\nWillow Bend ↔ Water Mill must connect. The opposite choice, followed through the station counts, cuts East Weir off from HQ. Connect Willow Bend–Water Mill.\n\nWillow Bend already has all its connections. Its remaining links can be ruled out. Rule out Willow Bend–West Ferry.\n\nWater Mill already has all its connections. Its remaining links can be ruled out. Rule out Water Mill–River Watch.\n\nWater Mill already has all its connections. Its remaining links can be ruled out. Rule out Water Mill–West Ferry.\n\nWest Ferry needs 1 more connection, with exactly 1 available. Each is required. Connect West Ferry–River Watch.",
    "reasoningSteps": 2
  },
  {
    "region": 2,
    "title": "The river circuit",
    "intro": "Restore the riverlands network. Every community needs a route home.",
    "difficulty": "Challenging",
    "nodes": [
      {
        "name": "Delta HQ",
        "need": 2,
        "x": 14,
        "y": 17,
        "backup": false
      },
      {
        "name": "Reed Bank",
        "need": 2,
        "x": 50,
        "y": 14,
        "backup": false
      },
      {
        "name": "East Weir",
        "need": 1,
        "x": 86,
        "y": 18,
        "backup": false
      },
      {
        "name": "Lock House",
        "need": 3,
        "x": 14,
        "y": 48,
        "backup": false
      },
      {
        "name": "Willow Bend",
        "need": 2,
        "x": 50,
        "y": 46,
        "backup": false
      },
      {
        "name": "Water Mill",
        "need": 1,
        "x": 86,
        "y": 48,
        "backup": false
      },
      {
        "name": "South Jetty",
        "need": 2,
        "x": 14,
        "y": 78,
        "backup": false
      },
      {
        "name": "West Ferry",
        "need": 2,
        "x": 50,
        "y": 78,
        "backup": false
      },
      {
        "name": "River Watch",
        "need": 1,
        "x": 86,
        "y": 78,
        "backup": false
      }
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        3,
        4
      ],
      [
        4,
        5
      ],
      [
        6,
        7
      ],
      [
        7,
        8
      ],
      [
        0,
        3
      ],
      [
        3,
        6
      ],
      [
        1,
        4
      ],
      [
        4,
        7
      ],
      [
        2,
        5
      ],
      [
        5,
        8
      ],
      [
        1,
        3
      ],
      [
        1,
        5
      ],
      [
        5,
        7
      ]
    ],
    "walkthrough": "Delta HQ needs 2 more connections, with exactly 2 available. Each is required. Connect Delta HQ–Reed Bank.\n\nDelta HQ needs 1 more connection, with exactly 1 available. Each is required. Connect Delta HQ–Lock House.\n\nSouth Jetty needs 2 more connections, with exactly 2 available. Each is required. Connect South Jetty–West Ferry.\n\nSouth Jetty needs 1 more connection, with exactly 1 available. Each is required. Connect Lock House–South Jetty.\n\nReed Bank ↔ East Weir must connect. The opposite choice, followed through the station counts, cuts East Weir off from HQ. Connect Reed Bank–East Weir.\n\nReed Bank already has all its connections. Its remaining links can be ruled out. Rule out Reed Bank–Willow Bend.\n\nReed Bank already has all its connections. Its remaining links can be ruled out. Rule out Reed Bank–Lock House.\n\nReed Bank already has all its connections. Its remaining links can be ruled out. Rule out Reed Bank–Water Mill.\n\nEast Weir already has all its connections. Its remaining links can be ruled out. Rule out East Weir–Water Mill.\n\nLock House needs 1 more connection, with exactly 1 available. Each is required. Connect Lock House–Willow Bend.\n\nWillow Bend ↔ Water Mill must connect. The opposite choice, followed through the station counts, cuts Water Mill off from HQ. Connect Willow Bend–Water Mill.\n\nWillow Bend already has all its connections. Its remaining links can be ruled out. Rule out Willow Bend–West Ferry.\n\nWater Mill already has all its connections. Its remaining links can be ruled out. Rule out Water Mill–River Watch.\n\nWater Mill already has all its connections. Its remaining links can be ruled out. Rule out Water Mill–West Ferry.\n\nWest Ferry needs 1 more connection, with exactly 1 available. Each is required. Connect West Ferry–River Watch.",
    "reasoningSteps": 2
  },
  {
    "region": 2,
    "title": "Between the banks",
    "intro": "West Ferry needs backup. Keep it connected if any single link fails.",
    "difficulty": "Expert",
    "nodes": [
      {
        "name": "Delta HQ",
        "need": 2,
        "x": 14,
        "y": 17,
        "backup": false
      },
      {
        "name": "Reed Bank",
        "need": 3,
        "x": 50,
        "y": 14,
        "backup": false
      },
      {
        "name": "East Weir",
        "need": 2,
        "x": 86,
        "y": 18,
        "backup": false
      },
      {
        "name": "Lock House",
        "need": 2,
        "x": 14,
        "y": 48,
        "backup": false
      },
      {
        "name": "Willow Bend",
        "need": 2,
        "x": 50,
        "y": 46,
        "backup": false
      },
      {
        "name": "Water Mill",
        "need": 2,
        "x": 86,
        "y": 48,
        "backup": false
      },
      {
        "name": "South Jetty",
        "need": 2,
        "x": 14,
        "y": 78,
        "backup": false
      },
      {
        "name": "West Ferry",
        "need": 2,
        "x": 50,
        "y": 78,
        "backup": true
      },
      {
        "name": "River Watch",
        "need": 1,
        "x": 86,
        "y": 78,
        "backup": false
      }
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        3,
        4
      ],
      [
        4,
        5
      ],
      [
        6,
        7
      ],
      [
        7,
        8
      ],
      [
        0,
        3
      ],
      [
        3,
        6
      ],
      [
        1,
        4
      ],
      [
        4,
        7
      ],
      [
        2,
        5
      ],
      [
        5,
        8
      ],
      [
        0,
        4
      ],
      [
        4,
        6
      ],
      [
        5,
        7
      ]
    ],
    "walkthrough": "Reed Bank needs 3 more connections, with exactly 3 available. Each is required. Connect Delta HQ–Reed Bank.\n\nReed Bank needs 2 more connections, with exactly 2 available. Each is required. Connect Reed Bank–East Weir.\n\nReed Bank needs 1 more connection, with exactly 1 available. Each is required. Connect Reed Bank–Willow Bend.\n\nEast Weir needs 1 more connection, with exactly 1 available. Each is required. Connect East Weir–Water Mill.\n\nLock House ↔ Willow Bend must stay inactive. The opposite choice forces West Ferry behind a single vulnerable link. A backup route must survive any one link failing. Rule out Lock House–Willow Bend.\n\nLock House needs 2 more connections, with exactly 2 available. Each is required. Connect Delta HQ–Lock House.\n\nDelta HQ already has all its connections. Its remaining links can be ruled out. Rule out Delta HQ–Willow Bend.\n\nLock House needs 1 more connection, with exactly 1 available. Each is required. Connect Lock House–South Jetty.\n\nWillow Bend ↔ Water Mill must stay inactive. The opposite choice forces West Ferry behind a single vulnerable link. A backup route must survive any one link failing. Rule out Willow Bend–Water Mill.\n\nSouth Jetty ↔ West Ferry must connect. The opposite choice forces West Ferry behind a single vulnerable link. A backup route must survive any one link failing. Connect South Jetty–West Ferry.\n\nSouth Jetty already has all its connections. Its remaining links can be ruled out. Rule out Willow Bend–South Jetty.\n\nWillow Bend needs 1 more connection, with exactly 1 available. Each is required. Connect Willow Bend–West Ferry.\n\nWest Ferry already has all its connections. Its remaining links can be ruled out. Rule out West Ferry–River Watch.\n\nWest Ferry already has all its connections. Its remaining links can be ruled out. Rule out Water Mill–West Ferry.\n\nWater Mill needs 1 more connection, with exactly 1 available. Each is required. Connect Water Mill–River Watch.",
    "reasoningSteps": 3
  },
  {
    "region": 2,
    "title": "A second crossing",
    "intro": "Reed Bank needs backup. Keep it connected if any single link fails.",
    "difficulty": "Expert",
    "nodes": [
      {
        "name": "Delta HQ",
        "need": 2,
        "x": 14,
        "y": 17,
        "backup": false
      },
      {
        "name": "Reed Bank",
        "need": 3,
        "x": 50,
        "y": 14,
        "backup": true
      },
      {
        "name": "East Weir",
        "need": 1,
        "x": 86,
        "y": 18,
        "backup": false
      },
      {
        "name": "Lock House",
        "need": 3,
        "x": 14,
        "y": 48,
        "backup": false
      },
      {
        "name": "Willow Bend",
        "need": 3,
        "x": 50,
        "y": 46,
        "backup": false
      },
      {
        "name": "Water Mill",
        "need": 1,
        "x": 86,
        "y": 48,
        "backup": false
      },
      {
        "name": "South Jetty",
        "need": 2,
        "x": 14,
        "y": 78,
        "backup": false
      },
      {
        "name": "West Ferry",
        "need": 2,
        "x": 50,
        "y": 78,
        "backup": false
      },
      {
        "name": "River Watch",
        "need": 1,
        "x": 86,
        "y": 78,
        "backup": false
      }
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        3,
        4
      ],
      [
        4,
        5
      ],
      [
        6,
        7
      ],
      [
        7,
        8
      ],
      [
        0,
        3
      ],
      [
        3,
        6
      ],
      [
        1,
        4
      ],
      [
        4,
        7
      ],
      [
        2,
        5
      ],
      [
        5,
        8
      ],
      [
        0,
        4
      ],
      [
        1,
        5
      ],
      [
        4,
        8
      ]
    ],
    "walkthrough": "Lock House needs 3 more connections, with exactly 3 available. Each is required. Connect Lock House–Willow Bend.\n\nLock House needs 2 more connections, with exactly 2 available. Each is required. Connect Delta HQ–Lock House.\n\nLock House needs 1 more connection, with exactly 1 available. Each is required. Connect Lock House–South Jetty.\n\nSouth Jetty needs 1 more connection, with exactly 1 available. Each is required. Connect South Jetty–West Ferry.\n\nDelta HQ ↔ Reed Bank must connect. The opposite choice forces Reed Bank behind a single vulnerable link. A backup route must survive any one link failing. Connect Delta HQ–Reed Bank.\n\nDelta HQ already has all its connections. Its remaining links can be ruled out. Rule out Delta HQ–Willow Bend.\n\nReed Bank ↔ East Weir must connect. The opposite choice forces Water Mill to exceed its count. Connect Reed Bank–East Weir.\n\nEast Weir already has all its connections. Its remaining links can be ruled out. Rule out East Weir–Water Mill.\n\nWillow Bend ↔ Water Mill must connect. Following the opposite choice through every remaining count leaves no network that reaches HQ with the required backup routes. Connect Willow Bend–Water Mill.\n\nWater Mill already has all its connections. Its remaining links can be ruled out. Rule out Water Mill–River Watch.\n\nWater Mill already has all its connections. Its remaining links can be ruled out. Rule out Reed Bank–Water Mill.\n\nReed Bank needs 1 more connection, with exactly 1 available. Each is required. Connect Reed Bank–Willow Bend.\n\nWillow Bend already has all its connections. Its remaining links can be ruled out. Rule out Willow Bend–West Ferry.\n\nWillow Bend already has all its connections. Its remaining links can be ruled out. Rule out Willow Bend–River Watch.\n\nWest Ferry needs 1 more connection, with exactly 1 available. Each is required. Connect West Ferry–River Watch.",
    "reasoningSteps": 3
  },
  {
    "region": 2,
    "title": "Delta echoes",
    "intro": "Willow Bend needs backup. Keep it connected if any single link fails.",
    "difficulty": "Expert",
    "nodes": [
      {
        "name": "Delta HQ",
        "need": 2,
        "x": 14,
        "y": 17,
        "backup": false
      },
      {
        "name": "Reed Bank",
        "need": 3,
        "x": 50,
        "y": 14,
        "backup": false
      },
      {
        "name": "East Weir",
        "need": 1,
        "x": 86,
        "y": 18,
        "backup": false
      },
      {
        "name": "Lock House",
        "need": 3,
        "x": 14,
        "y": 48,
        "backup": false
      },
      {
        "name": "Willow Bend",
        "need": 3,
        "x": 50,
        "y": 46,
        "backup": true
      },
      {
        "name": "Water Mill",
        "need": 1,
        "x": 86,
        "y": 48,
        "backup": false
      },
      {
        "name": "South Jetty",
        "need": 2,
        "x": 14,
        "y": 78,
        "backup": false
      },
      {
        "name": "West Ferry",
        "need": 2,
        "x": 50,
        "y": 78,
        "backup": false
      },
      {
        "name": "River Watch",
        "need": 1,
        "x": 86,
        "y": 78,
        "backup": false
      }
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        3,
        4
      ],
      [
        4,
        5
      ],
      [
        6,
        7
      ],
      [
        7,
        8
      ],
      [
        0,
        3
      ],
      [
        3,
        6
      ],
      [
        1,
        4
      ],
      [
        4,
        7
      ],
      [
        2,
        5
      ],
      [
        5,
        8
      ],
      [
        1,
        3
      ],
      [
        3,
        7
      ],
      [
        4,
        8
      ]
    ],
    "walkthrough": "Delta HQ needs 2 more connections, with exactly 2 available. Each is required. Connect Delta HQ–Reed Bank.\n\nDelta HQ needs 1 more connection, with exactly 1 available. Each is required. Connect Delta HQ–Lock House.\n\nSouth Jetty needs 2 more connections, with exactly 2 available. Each is required. Connect South Jetty–West Ferry.\n\nSouth Jetty needs 1 more connection, with exactly 1 available. Each is required. Connect Lock House–South Jetty.\n\nReed Bank ↔ East Weir must connect. The opposite choice, followed through the station counts, cuts East Weir off from HQ. Connect Reed Bank–East Weir.\n\nEast Weir already has all its connections. Its remaining links can be ruled out. Rule out East Weir–Water Mill.\n\nLock House ↔ Willow Bend must connect. Following the opposite choice through every remaining count leaves no network that reaches HQ with the required backup routes. Connect Lock House–Willow Bend.\n\nLock House already has all its connections. Its remaining links can be ruled out. Rule out Reed Bank–Lock House.\n\nReed Bank needs 1 more connection, with exactly 1 available. Each is required. Connect Reed Bank–Willow Bend.\n\nLock House already has all its connections. Its remaining links can be ruled out. Rule out Lock House–West Ferry.\n\nWillow Bend ↔ Water Mill must connect. The opposite choice, followed through the station counts, cuts Water Mill off from HQ. Connect Willow Bend–Water Mill.\n\nWillow Bend already has all its connections. Its remaining links can be ruled out. Rule out Willow Bend–West Ferry.\n\nWillow Bend already has all its connections. Its remaining links can be ruled out. Rule out Willow Bend–River Watch.\n\nWater Mill already has all its connections. Its remaining links can be ruled out. Rule out Water Mill–River Watch.\n\nWest Ferry needs 1 more connection, with exactly 1 available. Each is required. Connect West Ferry–River Watch.",
    "reasoningSteps": 3
  },
  {
    "region": 2,
    "title": "Every landing lit",
    "intro": "Reed Bank needs backup. Keep it connected if any single link fails.",
    "difficulty": "Expert",
    "nodes": [
      {
        "name": "Delta HQ",
        "need": 2,
        "x": 14,
        "y": 17,
        "backup": false
      },
      {
        "name": "Reed Bank",
        "need": 2,
        "x": 50,
        "y": 14,
        "backup": true
      },
      {
        "name": "East Weir",
        "need": 1,
        "x": 86,
        "y": 18,
        "backup": false
      },
      {
        "name": "Lock House",
        "need": 3,
        "x": 14,
        "y": 48,
        "backup": false
      },
      {
        "name": "Willow Bend",
        "need": 3,
        "x": 50,
        "y": 46,
        "backup": false
      },
      {
        "name": "Water Mill",
        "need": 2,
        "x": 86,
        "y": 48,
        "backup": false
      },
      {
        "name": "South Jetty",
        "need": 2,
        "x": 14,
        "y": 78,
        "backup": false
      },
      {
        "name": "West Ferry",
        "need": 2,
        "x": 50,
        "y": 78,
        "backup": false
      },
      {
        "name": "River Watch",
        "need": 1,
        "x": 86,
        "y": 78,
        "backup": false
      }
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        3,
        4
      ],
      [
        4,
        5
      ],
      [
        6,
        7
      ],
      [
        7,
        8
      ],
      [
        0,
        3
      ],
      [
        3,
        6
      ],
      [
        1,
        4
      ],
      [
        4,
        7
      ],
      [
        2,
        5
      ],
      [
        5,
        8
      ],
      [
        1,
        5
      ],
      [
        3,
        7
      ]
    ],
    "walkthrough": "Delta HQ needs 2 more connections, with exactly 2 available. Each is required. Connect Delta HQ–Reed Bank.\n\nDelta HQ needs 1 more connection, with exactly 1 available. Each is required. Connect Delta HQ–Lock House.\n\nSouth Jetty needs 2 more connections, with exactly 2 available. Each is required. Connect South Jetty–West Ferry.\n\nSouth Jetty needs 1 more connection, with exactly 1 available. Each is required. Connect Lock House–South Jetty.\n\nReed Bank ↔ East Weir must stay inactive. The opposite choice forces Reed Bank behind a single vulnerable link. A backup route must survive any one link failing. Rule out Reed Bank–East Weir.\n\nEast Weir needs 1 more connection, with exactly 1 available. Each is required. Connect East Weir–Water Mill.\n\nLock House ↔ Willow Bend must connect. The opposite choice forces West Ferry to exceed its count. Connect Lock House–Willow Bend.\n\nLock House already has all its connections. Its remaining links can be ruled out. Rule out Lock House–West Ferry.\n\nWillow Bend ↔ Water Mill must connect. The opposite choice, followed through the station counts, cuts East Weir off from HQ. Connect Willow Bend–Water Mill.\n\nWater Mill already has all its connections. Its remaining links can be ruled out. Rule out Water Mill–River Watch.\n\nWater Mill already has all its connections. Its remaining links can be ruled out. Rule out Reed Bank–Water Mill.\n\nReed Bank needs 1 more connection, with exactly 1 available. Each is required. Connect Reed Bank–Willow Bend.\n\nWillow Bend already has all its connections. Its remaining links can be ruled out. Rule out Willow Bend–West Ferry.\n\nWest Ferry needs 1 more connection, with exactly 1 available. Each is required. Connect West Ferry–River Watch.",
    "reasoningSteps": 3
  },
  {
    "region": 3,
    "title": "Windward signals",
    "intro": "Sunfield needs backup. Keep it connected if any single link fails.",
    "difficulty": "Expert",
    "nodes": [
      {
        "name": "Prairie HQ",
        "need": 2,
        "x": 14,
        "y": 17,
        "backup": false
      },
      {
        "name": "Wind Farm",
        "need": 3,
        "x": 50,
        "y": 14,
        "backup": false
      },
      {
        "name": "Silo Point",
        "need": 1,
        "x": 86,
        "y": 18,
        "backup": false
      },
      {
        "name": "Sunfield",
        "need": 2,
        "x": 14,
        "y": 48,
        "backup": true
      },
      {
        "name": "Crossroads",
        "need": 3,
        "x": 50,
        "y": 46,
        "backup": false
      },
      {
        "name": "Grain Mill",
        "need": 1,
        "x": 86,
        "y": 48,
        "backup": false
      },
      {
        "name": "West Well",
        "need": 2,
        "x": 14,
        "y": 78,
        "backup": false
      },
      {
        "name": "Rail Stop",
        "need": 3,
        "x": 50,
        "y": 78,
        "backup": false
      },
      {
        "name": "Sky Watch",
        "need": 1,
        "x": 86,
        "y": 78,
        "backup": false
      }
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        3,
        4
      ],
      [
        4,
        5
      ],
      [
        6,
        7
      ],
      [
        7,
        8
      ],
      [
        0,
        3
      ],
      [
        3,
        6
      ],
      [
        1,
        4
      ],
      [
        4,
        7
      ],
      [
        2,
        5
      ],
      [
        5,
        8
      ],
      [
        0,
        4
      ],
      [
        3,
        7
      ],
      [
        5,
        7
      ]
    ],
    "walkthrough": "Wind Farm needs 3 more connections, with exactly 3 available. Each is required. Connect Prairie HQ–Wind Farm.\n\nWind Farm needs 2 more connections, with exactly 2 available. Each is required. Connect Wind Farm–Silo Point.\n\nWind Farm needs 1 more connection, with exactly 1 available. Each is required. Connect Wind Farm–Crossroads.\n\nSilo Point already has all its connections. Its remaining links can be ruled out. Rule out Silo Point–Grain Mill.\n\nWest Well needs 2 more connections, with exactly 2 available. Each is required. Connect West Well–Rail Stop.\n\nWest Well needs 1 more connection, with exactly 1 available. Each is required. Connect Sunfield–West Well.\n\nSunfield ↔ Crossroads must stay inactive. The opposite choice forces Sunfield behind a single vulnerable link. A backup route must survive any one link failing. Rule out Sunfield–Crossroads.\n\nCrossroads ↔ Grain Mill must connect. The opposite choice forces Sunfield behind a single vulnerable link. A backup route must survive any one link failing. Connect Crossroads–Grain Mill.\n\nGrain Mill already has all its connections. Its remaining links can be ruled out. Rule out Grain Mill–Sky Watch.\n\nGrain Mill already has all its connections. Its remaining links can be ruled out. Rule out Grain Mill–Rail Stop.\n\nSky Watch needs 1 more connection, with exactly 1 available. Each is required. Connect Rail Stop–Sky Watch.\n\nPrairie HQ ↔ Sunfield must connect. The opposite choice forces Sunfield behind a single vulnerable link. A backup route must survive any one link failing. Connect Prairie HQ–Sunfield.\n\nPrairie HQ already has all its connections. Its remaining links can be ruled out. Rule out Prairie HQ–Crossroads.\n\nSunfield already has all its connections. Its remaining links can be ruled out. Rule out Sunfield–Rail Stop.\n\nCrossroads needs 1 more connection, with exactly 1 available. Each is required. Connect Crossroads–Rail Stop.",
    "reasoningSteps": 3
  },
  {
    "region": 3,
    "title": "Along the rail",
    "intro": "Grain Mill needs backup. Keep it connected if any single link fails.",
    "difficulty": "Expert",
    "nodes": [
      {
        "name": "Prairie HQ",
        "need": 2,
        "x": 14,
        "y": 17,
        "backup": false
      },
      {
        "name": "Wind Farm",
        "need": 2,
        "x": 50,
        "y": 14,
        "backup": false
      },
      {
        "name": "Silo Point",
        "need": 2,
        "x": 86,
        "y": 18,
        "backup": false
      },
      {
        "name": "Sunfield",
        "need": 3,
        "x": 14,
        "y": 48,
        "backup": false
      },
      {
        "name": "Crossroads",
        "need": 2,
        "x": 50,
        "y": 46,
        "backup": false
      },
      {
        "name": "Grain Mill",
        "need": 2,
        "x": 86,
        "y": 48,
        "backup": true
      },
      {
        "name": "West Well",
        "need": 2,
        "x": 14,
        "y": 78,
        "backup": false
      },
      {
        "name": "Rail Stop",
        "need": 2,
        "x": 50,
        "y": 78,
        "backup": false
      },
      {
        "name": "Sky Watch",
        "need": 1,
        "x": 86,
        "y": 78,
        "backup": false
      }
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        3,
        4
      ],
      [
        4,
        5
      ],
      [
        6,
        7
      ],
      [
        7,
        8
      ],
      [
        0,
        3
      ],
      [
        3,
        6
      ],
      [
        1,
        4
      ],
      [
        4,
        7
      ],
      [
        2,
        5
      ],
      [
        5,
        8
      ],
      [
        0,
        4
      ],
      [
        2,
        4
      ],
      [
        5,
        7
      ]
    ],
    "walkthrough": "Sunfield needs 3 more connections, with exactly 3 available. Each is required. Connect Sunfield–Crossroads.\n\nSunfield needs 2 more connections, with exactly 2 available. Each is required. Connect Prairie HQ–Sunfield.\n\nSunfield needs 1 more connection, with exactly 1 available. Each is required. Connect Sunfield–West Well.\n\nWest Well needs 1 more connection, with exactly 1 available. Each is required. Connect West Well–Rail Stop.\n\nPrairie HQ ↔ Wind Farm must connect. The opposite choice forces Crossroads to exceed its count. Connect Prairie HQ–Wind Farm.\n\nPrairie HQ already has all its connections. Its remaining links can be ruled out. Rule out Prairie HQ–Crossroads.\n\nWind Farm ↔ Silo Point must connect. The opposite choice forces Crossroads to exceed its count. Connect Wind Farm–Silo Point.\n\nWind Farm already has all its connections. Its remaining links can be ruled out. Rule out Wind Farm–Crossroads.\n\nCrossroads ↔ Grain Mill must connect. Following the opposite choice through every remaining count leaves no network that reaches HQ with the required backup routes. Connect Crossroads–Grain Mill.\n\nCrossroads already has all its connections. Its remaining links can be ruled out. Rule out Crossroads–Rail Stop.\n\nCrossroads already has all its connections. Its remaining links can be ruled out. Rule out Silo Point–Crossroads.\n\nSilo Point needs 1 more connection, with exactly 1 available. Each is required. Connect Silo Point–Grain Mill.\n\nGrain Mill already has all its connections. Its remaining links can be ruled out. Rule out Grain Mill–Sky Watch.\n\nGrain Mill already has all its connections. Its remaining links can be ruled out. Rule out Grain Mill–Rail Stop.\n\nRail Stop needs 1 more connection, with exactly 1 available. Each is required. Connect Rail Stop–Sky Watch.",
    "reasoningSteps": 3
  },
  {
    "region": 3,
    "title": "Across Sunfield",
    "intro": "Wind Farm needs backup. Keep it connected if any single link fails.",
    "difficulty": "Expert",
    "nodes": [
      {
        "name": "Prairie HQ",
        "need": 2,
        "x": 14,
        "y": 17,
        "backup": false
      },
      {
        "name": "Wind Farm",
        "need": 2,
        "x": 50,
        "y": 14,
        "backup": true
      },
      {
        "name": "Silo Point",
        "need": 1,
        "x": 86,
        "y": 18,
        "backup": false
      },
      {
        "name": "Sunfield",
        "need": 3,
        "x": 14,
        "y": 48,
        "backup": false
      },
      {
        "name": "Crossroads",
        "need": 3,
        "x": 50,
        "y": 46,
        "backup": false
      },
      {
        "name": "Grain Mill",
        "need": 2,
        "x": 86,
        "y": 48,
        "backup": false
      },
      {
        "name": "West Well",
        "need": 2,
        "x": 14,
        "y": 78,
        "backup": false
      },
      {
        "name": "Rail Stop",
        "need": 2,
        "x": 50,
        "y": 78,
        "backup": false
      },
      {
        "name": "Sky Watch",
        "need": 1,
        "x": 86,
        "y": 78,
        "backup": false
      }
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        3,
        4
      ],
      [
        4,
        5
      ],
      [
        6,
        7
      ],
      [
        7,
        8
      ],
      [
        0,
        3
      ],
      [
        3,
        6
      ],
      [
        1,
        4
      ],
      [
        4,
        7
      ],
      [
        2,
        5
      ],
      [
        5,
        8
      ],
      [
        1,
        3
      ],
      [
        3,
        7
      ],
      [
        5,
        7
      ]
    ],
    "walkthrough": "Prairie HQ needs 2 more connections, with exactly 2 available. Each is required. Connect Prairie HQ–Wind Farm.\n\nPrairie HQ needs 1 more connection, with exactly 1 available. Each is required. Connect Prairie HQ–Sunfield.\n\nWest Well needs 2 more connections, with exactly 2 available. Each is required. Connect West Well–Rail Stop.\n\nWest Well needs 1 more connection, with exactly 1 available. Each is required. Connect Sunfield–West Well.\n\nWind Farm ↔ Silo Point must stay inactive. The opposite choice forces Wind Farm behind a single vulnerable link. A backup route must survive any one link failing. Rule out Wind Farm–Silo Point.\n\nSilo Point needs 1 more connection, with exactly 1 available. Each is required. Connect Silo Point–Grain Mill.\n\nSunfield ↔ Crossroads must connect. The opposite choice forces Rail Stop to exceed its count. Connect Sunfield–Crossroads.\n\nSunfield already has all its connections. Its remaining links can be ruled out. Rule out Wind Farm–Sunfield.\n\nWind Farm needs 1 more connection, with exactly 1 available. Each is required. Connect Wind Farm–Crossroads.\n\nSunfield already has all its connections. Its remaining links can be ruled out. Rule out Sunfield–Rail Stop.\n\nCrossroads ↔ Grain Mill must connect. The opposite choice, followed through the station counts, cuts Silo Point off from HQ. Connect Crossroads–Grain Mill.\n\nCrossroads already has all its connections. Its remaining links can be ruled out. Rule out Crossroads–Rail Stop.\n\nGrain Mill already has all its connections. Its remaining links can be ruled out. Rule out Grain Mill–Sky Watch.\n\nGrain Mill already has all its connections. Its remaining links can be ruled out. Rule out Grain Mill–Rail Stop.\n\nRail Stop needs 1 more connection, with exactly 1 available. Each is required. Connect Rail Stop–Sky Watch.",
    "reasoningSteps": 3
  },
  {
    "region": 3,
    "title": "The grain route",
    "intro": "Wind Farm needs backup. Keep it connected if any single link fails.",
    "difficulty": "Expert",
    "nodes": [
      {
        "name": "Prairie HQ",
        "need": 2,
        "x": 14,
        "y": 17,
        "backup": false
      },
      {
        "name": "Wind Farm",
        "need": 2,
        "x": 50,
        "y": 14,
        "backup": true
      },
      {
        "name": "Silo Point",
        "need": 1,
        "x": 86,
        "y": 18,
        "backup": false
      },
      {
        "name": "Sunfield",
        "need": 3,
        "x": 14,
        "y": 48,
        "backup": false
      },
      {
        "name": "Crossroads",
        "need": 3,
        "x": 50,
        "y": 46,
        "backup": false
      },
      {
        "name": "Grain Mill",
        "need": 2,
        "x": 86,
        "y": 48,
        "backup": false
      },
      {
        "name": "West Well",
        "need": 2,
        "x": 14,
        "y": 78,
        "backup": false
      },
      {
        "name": "Rail Stop",
        "need": 2,
        "x": 50,
        "y": 78,
        "backup": false
      },
      {
        "name": "Sky Watch",
        "need": 1,
        "x": 86,
        "y": 78,
        "backup": false
      }
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        3,
        4
      ],
      [
        4,
        5
      ],
      [
        6,
        7
      ],
      [
        7,
        8
      ],
      [
        0,
        3
      ],
      [
        3,
        6
      ],
      [
        1,
        4
      ],
      [
        4,
        7
      ],
      [
        2,
        5
      ],
      [
        5,
        8
      ],
      [
        1,
        3
      ],
      [
        1,
        5
      ],
      [
        5,
        7
      ]
    ],
    "walkthrough": "Prairie HQ needs 2 more connections, with exactly 2 available. Each is required. Connect Prairie HQ–Wind Farm.\n\nPrairie HQ needs 1 more connection, with exactly 1 available. Each is required. Connect Prairie HQ–Sunfield.\n\nWest Well needs 2 more connections, with exactly 2 available. Each is required. Connect West Well–Rail Stop.\n\nWest Well needs 1 more connection, with exactly 1 available. Each is required. Connect Sunfield–West Well.\n\nWind Farm ↔ Silo Point must stay inactive. The opposite choice forces Wind Farm behind a single vulnerable link. A backup route must survive any one link failing. Rule out Wind Farm–Silo Point.\n\nSilo Point needs 1 more connection, with exactly 1 available. Each is required. Connect Silo Point–Grain Mill.\n\nSunfield ↔ Crossroads must connect. The opposite choice forces Crossroads to run out of available links. Connect Sunfield–Crossroads.\n\nSunfield already has all its connections. Its remaining links can be ruled out. Rule out Wind Farm–Sunfield.\n\nCrossroads ↔ Grain Mill must connect. The opposite choice, followed through the station counts, cuts Silo Point off from HQ. Connect Crossroads–Grain Mill.\n\nGrain Mill already has all its connections. Its remaining links can be ruled out. Rule out Grain Mill–Sky Watch.\n\nGrain Mill already has all its connections. Its remaining links can be ruled out. Rule out Wind Farm–Grain Mill.\n\nWind Farm needs 1 more connection, with exactly 1 available. Each is required. Connect Wind Farm–Crossroads.\n\nCrossroads already has all its connections. Its remaining links can be ruled out. Rule out Crossroads–Rail Stop.\n\nGrain Mill already has all its connections. Its remaining links can be ruled out. Rule out Grain Mill–Rail Stop.\n\nRail Stop needs 1 more connection, with exactly 1 available. Each is required. Connect Rail Stop–Sky Watch.",
    "reasoningSteps": 3
  },
  {
    "region": 3,
    "title": "Crossroads calling",
    "intro": "Wind Farm needs backup. Keep it connected if any single link fails.",
    "difficulty": "Expert",
    "nodes": [
      {
        "name": "Prairie HQ",
        "need": 2,
        "x": 14,
        "y": 17,
        "backup": false
      },
      {
        "name": "Wind Farm",
        "need": 2,
        "x": 50,
        "y": 14,
        "backup": true
      },
      {
        "name": "Silo Point",
        "need": 1,
        "x": 86,
        "y": 18,
        "backup": false
      },
      {
        "name": "Sunfield",
        "need": 2,
        "x": 14,
        "y": 48,
        "backup": false
      },
      {
        "name": "Crossroads",
        "need": 3,
        "x": 50,
        "y": 46,
        "backup": false
      },
      {
        "name": "Grain Mill",
        "need": 3,
        "x": 86,
        "y": 48,
        "backup": false
      },
      {
        "name": "West Well",
        "need": 1,
        "x": 14,
        "y": 78,
        "backup": false
      },
      {
        "name": "Rail Stop",
        "need": 2,
        "x": 50,
        "y": 78,
        "backup": false
      },
      {
        "name": "Sky Watch",
        "need": 2,
        "x": 86,
        "y": 78,
        "backup": false
      }
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        3,
        4
      ],
      [
        4,
        5
      ],
      [
        6,
        7
      ],
      [
        7,
        8
      ],
      [
        0,
        3
      ],
      [
        3,
        6
      ],
      [
        1,
        4
      ],
      [
        4,
        7
      ],
      [
        2,
        5
      ],
      [
        5,
        8
      ],
      [
        0,
        4
      ],
      [
        4,
        6
      ],
      [
        5,
        7
      ]
    ],
    "walkthrough": "Sky Watch needs 2 more connections, with exactly 2 available. Each is required. Connect Rail Stop–Sky Watch.\n\nSky Watch needs 1 more connection, with exactly 1 available. Each is required. Connect Grain Mill–Sky Watch.\n\nPrairie HQ ↔ Wind Farm must connect. The opposite choice forces Wind Farm behind a single vulnerable link. A backup route must survive any one link failing. Connect Prairie HQ–Wind Farm.\n\nWind Farm ↔ Silo Point must stay inactive. The opposite choice forces Wind Farm behind a single vulnerable link. A backup route must survive any one link failing. Rule out Wind Farm–Silo Point.\n\nWind Farm needs 1 more connection, with exactly 1 available. Each is required. Connect Wind Farm–Crossroads.\n\nSilo Point needs 1 more connection, with exactly 1 available. Each is required. Connect Silo Point–Grain Mill.\n\nSunfield ↔ Crossroads must connect. The opposite choice forces Wind Farm behind a single vulnerable link. A backup route must survive any one link failing. Connect Sunfield–Crossroads.\n\nCrossroads ↔ Grain Mill must connect. The opposite choice, followed through the station counts, cuts Silo Point off from HQ. Connect Crossroads–Grain Mill.\n\nCrossroads already has all its connections. Its remaining links can be ruled out. Rule out Crossroads–Rail Stop.\n\nCrossroads already has all its connections. Its remaining links can be ruled out. Rule out Prairie HQ–Crossroads.\n\nPrairie HQ needs 1 more connection, with exactly 1 available. Each is required. Connect Prairie HQ–Sunfield.\n\nSunfield already has all its connections. Its remaining links can be ruled out. Rule out Sunfield–West Well.\n\nCrossroads already has all its connections. Its remaining links can be ruled out. Rule out Crossroads–West Well.\n\nGrain Mill already has all its connections. Its remaining links can be ruled out. Rule out Grain Mill–Rail Stop.\n\nWest Well needs 1 more connection, with exactly 1 available. Each is required. Connect West Well–Rail Stop.",
    "reasoningSteps": 4
  },
  {
    "region": 3,
    "title": "West of the well",
    "intro": "West Well needs backup. Keep it connected if any single link fails.",
    "difficulty": "Expert",
    "nodes": [
      {
        "name": "Prairie HQ",
        "need": 2,
        "x": 14,
        "y": 17,
        "backup": false
      },
      {
        "name": "Wind Farm",
        "need": 3,
        "x": 50,
        "y": 14,
        "backup": false
      },
      {
        "name": "Silo Point",
        "need": 2,
        "x": 86,
        "y": 18,
        "backup": false
      },
      {
        "name": "Sunfield",
        "need": 3,
        "x": 14,
        "y": 48,
        "backup": false
      },
      {
        "name": "Crossroads",
        "need": 3,
        "x": 50,
        "y": 46,
        "backup": false
      },
      {
        "name": "Grain Mill",
        "need": 2,
        "x": 86,
        "y": 48,
        "backup": false
      },
      {
        "name": "West Well",
        "need": 2,
        "x": 14,
        "y": 78,
        "backup": true
      },
      {
        "name": "Rail Stop",
        "need": 2,
        "x": 50,
        "y": 78,
        "backup": false
      },
      {
        "name": "Sky Watch",
        "need": 1,
        "x": 86,
        "y": 78,
        "backup": false
      }
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        3,
        4
      ],
      [
        4,
        5
      ],
      [
        6,
        7
      ],
      [
        7,
        8
      ],
      [
        0,
        3
      ],
      [
        3,
        6
      ],
      [
        1,
        4
      ],
      [
        4,
        7
      ],
      [
        2,
        5
      ],
      [
        5,
        8
      ],
      [
        0,
        4
      ],
      [
        1,
        5
      ],
      [
        4,
        8
      ]
    ],
    "walkthrough": "Silo Point needs 2 more connections, with exactly 2 available. Each is required. Connect Wind Farm–Silo Point.\n\nSilo Point needs 1 more connection, with exactly 1 available. Each is required. Connect Silo Point–Grain Mill.\n\nSunfield needs 3 more connections, with exactly 3 available. Each is required. Connect Sunfield–Crossroads.\n\nSunfield needs 2 more connections, with exactly 2 available. Each is required. Connect Prairie HQ–Sunfield.\n\nSunfield needs 1 more connection, with exactly 1 available. Each is required. Connect Sunfield–West Well.\n\nWest Well needs 1 more connection, with exactly 1 available. Each is required. Connect West Well–Rail Stop.\n\nPrairie HQ ↔ Wind Farm must connect. The opposite choice forces West Well behind a single vulnerable link. A backup route must survive any one link failing. Connect Prairie HQ–Wind Farm.\n\nPrairie HQ already has all its connections. Its remaining links can be ruled out. Rule out Prairie HQ–Crossroads.\n\nCrossroads ↔ Grain Mill must stay inactive. The opposite choice forces West Well behind a single vulnerable link. A backup route must survive any one link failing. Rule out Crossroads–Grain Mill.\n\nRail Stop ↔ Sky Watch must stay inactive. The opposite choice forces Sky Watch to exceed its count. Rule out Rail Stop–Sky Watch.\n\nRail Stop needs 1 more connection, with exactly 1 available. Each is required. Connect Crossroads–Rail Stop.\n\nWind Farm ↔ Crossroads must connect. The opposite choice forces West Well behind a single vulnerable link. A backup route must survive any one link failing. Connect Wind Farm–Crossroads.\n\nWind Farm already has all its connections. Its remaining links can be ruled out. Rule out Wind Farm–Grain Mill.\n\nCrossroads already has all its connections. Its remaining links can be ruled out. Rule out Crossroads–Sky Watch.\n\nGrain Mill needs 1 more connection, with exactly 1 available. Each is required. Connect Grain Mill–Sky Watch.",
    "reasoningSteps": 4
  },
  {
    "region": 3,
    "title": "Open country",
    "intro": "Sky Watch needs backup. Keep it connected if any single link fails.",
    "difficulty": "Expert",
    "nodes": [
      {
        "name": "Prairie HQ",
        "need": 2,
        "x": 14,
        "y": 17,
        "backup": false
      },
      {
        "name": "Wind Farm",
        "need": 2,
        "x": 50,
        "y": 14,
        "backup": false
      },
      {
        "name": "Silo Point",
        "need": 1,
        "x": 86,
        "y": 18,
        "backup": false
      },
      {
        "name": "Sunfield",
        "need": 3,
        "x": 14,
        "y": 48,
        "backup": false
      },
      {
        "name": "Crossroads",
        "need": 3,
        "x": 50,
        "y": 46,
        "backup": false
      },
      {
        "name": "Grain Mill",
        "need": 2,
        "x": 86,
        "y": 48,
        "backup": false
      },
      {
        "name": "West Well",
        "need": 2,
        "x": 14,
        "y": 78,
        "backup": false
      },
      {
        "name": "Rail Stop",
        "need": 3,
        "x": 50,
        "y": 78,
        "backup": false
      },
      {
        "name": "Sky Watch",
        "need": 2,
        "x": 86,
        "y": 78,
        "backup": true
      }
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        3,
        4
      ],
      [
        4,
        5
      ],
      [
        6,
        7
      ],
      [
        7,
        8
      ],
      [
        0,
        3
      ],
      [
        3,
        6
      ],
      [
        1,
        4
      ],
      [
        4,
        7
      ],
      [
        2,
        5
      ],
      [
        5,
        8
      ],
      [
        1,
        3
      ],
      [
        3,
        7
      ],
      [
        4,
        8
      ]
    ],
    "walkthrough": "Prairie HQ needs 2 more connections, with exactly 2 available. Each is required. Connect Prairie HQ–Wind Farm.\n\nPrairie HQ needs 1 more connection, with exactly 1 available. Each is required. Connect Prairie HQ–Sunfield.\n\nWest Well needs 2 more connections, with exactly 2 available. Each is required. Connect West Well–Rail Stop.\n\nWest Well needs 1 more connection, with exactly 1 available. Each is required. Connect Sunfield–West Well.\n\nWind Farm ↔ Silo Point must stay inactive. The opposite choice forces Sky Watch behind a single vulnerable link. A backup route must survive any one link failing. Rule out Wind Farm–Silo Point.\n\nSilo Point needs 1 more connection, with exactly 1 available. Each is required. Connect Silo Point–Grain Mill.\n\nSunfield ↔ Crossroads must stay inactive. The opposite choice forces Sky Watch behind a single vulnerable link. A backup route must survive any one link failing. Rule out Sunfield–Crossroads.\n\nCrossroads ↔ Grain Mill must connect. The opposite choice forces Sky Watch behind a single vulnerable link. A backup route must survive any one link failing. Connect Crossroads–Grain Mill.\n\nGrain Mill already has all its connections. Its remaining links can be ruled out. Rule out Grain Mill–Sky Watch.\n\nSky Watch needs 2 more connections, with exactly 2 available. Each is required. Connect Rail Stop–Sky Watch.\n\nSky Watch needs 1 more connection, with exactly 1 available. Each is required. Connect Crossroads–Sky Watch.\n\nWind Farm ↔ Crossroads must connect. The opposite choice forces Sky Watch behind a single vulnerable link. A backup route must survive any one link failing. Connect Wind Farm–Crossroads.\n\nWind Farm already has all its connections. Its remaining links can be ruled out. Rule out Wind Farm–Sunfield.\n\nSunfield needs 1 more connection, with exactly 1 available. Each is required. Connect Sunfield–Rail Stop.",
    "reasoningSteps": 4
  },
  {
    "region": 3,
    "title": "The distant horizon",
    "intro": "Grain Mill needs backup. Keep it connected if any single link fails.",
    "difficulty": "Expert",
    "nodes": [
      {
        "name": "Prairie HQ",
        "need": 2,
        "x": 14,
        "y": 17,
        "backup": false
      },
      {
        "name": "Wind Farm",
        "need": 3,
        "x": 50,
        "y": 14,
        "backup": false
      },
      {
        "name": "Silo Point",
        "need": 1,
        "x": 86,
        "y": 18,
        "backup": false
      },
      {
        "name": "Sunfield",
        "need": 3,
        "x": 14,
        "y": 48,
        "backup": false
      },
      {
        "name": "Crossroads",
        "need": 3,
        "x": 50,
        "y": 46,
        "backup": false
      },
      {
        "name": "Grain Mill",
        "need": 2,
        "x": 86,
        "y": 48,
        "backup": true
      },
      {
        "name": "West Well",
        "need": 1,
        "x": 14,
        "y": 78,
        "backup": false
      },
      {
        "name": "Rail Stop",
        "need": 2,
        "x": 50,
        "y": 78,
        "backup": false
      },
      {
        "name": "Sky Watch",
        "need": 1,
        "x": 86,
        "y": 78,
        "backup": false
      }
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        3,
        4
      ],
      [
        4,
        5
      ],
      [
        6,
        7
      ],
      [
        7,
        8
      ],
      [
        0,
        3
      ],
      [
        3,
        6
      ],
      [
        1,
        4
      ],
      [
        4,
        7
      ],
      [
        2,
        5
      ],
      [
        5,
        8
      ],
      [
        1,
        5
      ],
      [
        3,
        7
      ]
    ],
    "walkthrough": "Prairie HQ needs 2 more connections, with exactly 2 available. Each is required. Connect Prairie HQ–Wind Farm.\n\nPrairie HQ needs 1 more connection, with exactly 1 available. Each is required. Connect Prairie HQ–Sunfield.\n\nWind Farm ↔ Silo Point must connect. The opposite choice forces Grain Mill behind a single vulnerable link. A backup route must survive any one link failing. Connect Wind Farm–Silo Point.\n\nSilo Point already has all its connections. Its remaining links can be ruled out. Rule out Silo Point–Grain Mill.\n\nSunfield ↔ Crossroads must connect. The opposite choice forces Grain Mill behind a single vulnerable link. A backup route must survive any one link failing. Connect Sunfield–Crossroads.\n\nCrossroads ↔ Grain Mill must connect. The opposite choice forces Grain Mill behind a single vulnerable link. A backup route must survive any one link failing. Connect Crossroads–Grain Mill.\n\nWest Well ↔ Rail Stop must stay inactive. The opposite choice forces Grain Mill behind a single vulnerable link. A backup route must survive any one link failing. Rule out West Well–Rail Stop.\n\nWest Well needs 1 more connection, with exactly 1 available. Each is required. Connect Sunfield–West Well.\n\nSunfield already has all its connections. Its remaining links can be ruled out. Rule out Sunfield–Rail Stop.\n\nRail Stop needs 2 more connections, with exactly 2 available. Each is required. Connect Rail Stop–Sky Watch.\n\nRail Stop needs 1 more connection, with exactly 1 available. Each is required. Connect Crossroads–Rail Stop.\n\nCrossroads already has all its connections. Its remaining links can be ruled out. Rule out Wind Farm–Crossroads.\n\nWind Farm needs 1 more connection, with exactly 1 available. Each is required. Connect Wind Farm–Grain Mill.",
    "reasoningSteps": 4
  },
  {
    "region": 4,
    "title": "A voice in the mist",
    "intro": "Gull Point needs backup. Keep it connected if any single link fails.",
    "difficulty": "Expert",
    "nodes": [
      {
        "name": "Beacon HQ",
        "need": 2,
        "x": 14,
        "y": 17,
        "backup": false
      },
      {
        "name": "Gull Point",
        "need": 3,
        "x": 50,
        "y": 14,
        "backup": true
      },
      {
        "name": "North Light",
        "need": 2,
        "x": 86,
        "y": 18,
        "backup": false
      },
      {
        "name": "Shell Cove",
        "need": 2,
        "x": 14,
        "y": 48,
        "backup": false
      },
      {
        "name": "Port Haven",
        "need": 2,
        "x": 50,
        "y": 46,
        "backup": false
      },
      {
        "name": "Rock House",
        "need": 2,
        "x": 86,
        "y": 48,
        "backup": false
      },
      {
        "name": "Sea Garden",
        "need": 2,
        "x": 14,
        "y": 78,
        "backup": false
      },
      {
        "name": "East Pier",
        "need": 2,
        "x": 50,
        "y": 78,
        "backup": false
      },
      {
        "name": "Star Island",
        "need": 1,
        "x": 86,
        "y": 78,
        "backup": false
      }
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        3,
        4
      ],
      [
        4,
        5
      ],
      [
        6,
        7
      ],
      [
        7,
        8
      ],
      [
        0,
        3
      ],
      [
        3,
        6
      ],
      [
        1,
        4
      ],
      [
        4,
        7
      ],
      [
        2,
        5
      ],
      [
        5,
        8
      ],
      [
        0,
        4
      ],
      [
        3,
        7
      ],
      [
        5,
        7
      ]
    ],
    "walkthrough": "Gull Point needs 3 more connections, with exactly 3 available. Each is required. Connect Beacon HQ–Gull Point.\n\nGull Point needs 2 more connections, with exactly 2 available. Each is required. Connect Gull Point–North Light.\n\nGull Point needs 1 more connection, with exactly 1 available. Each is required. Connect Gull Point–Port Haven.\n\nNorth Light needs 1 more connection, with exactly 1 available. Each is required. Connect North Light–Rock House.\n\nSea Garden needs 2 more connections, with exactly 2 available. Each is required. Connect Sea Garden–East Pier.\n\nSea Garden needs 1 more connection, with exactly 1 available. Each is required. Connect Shell Cove–Sea Garden.\n\nShell Cove ↔ Port Haven must stay inactive. The opposite choice forces Port Haven to exceed its count. Rule out Shell Cove–Port Haven.\n\nPort Haven ↔ Rock House must stay inactive. The opposite choice forces Gull Point behind a single vulnerable link. A backup route must survive any one link failing. Rule out Port Haven–Rock House.\n\nEast Pier ↔ Star Island must stay inactive. The opposite choice forces Port Haven to run out of available links. Rule out East Pier–Star Island.\n\nStar Island needs 1 more connection, with exactly 1 available. Each is required. Connect Rock House–Star Island.\n\nRock House already has all its connections. Its remaining links can be ruled out. Rule out Rock House–East Pier.\n\nBeacon HQ ↔ Shell Cove must connect. The opposite choice, followed through the station counts, cuts Shell Cove off from HQ. Connect Beacon HQ–Shell Cove.\n\nBeacon HQ already has all its connections. Its remaining links can be ruled out. Rule out Beacon HQ–Port Haven.\n\nShell Cove already has all its connections. Its remaining links can be ruled out. Rule out Shell Cove–East Pier.\n\nPort Haven needs 1 more connection, with exactly 1 available. Each is required. Connect Port Haven–East Pier.",
    "reasoningSteps": 4
  },
  {
    "region": 4,
    "title": "Cove connections",
    "intro": "Gull Point needs backup. Keep it connected if any single link fails.",
    "difficulty": "Expert",
    "nodes": [
      {
        "name": "Beacon HQ",
        "need": 2,
        "x": 14,
        "y": 17,
        "backup": false
      },
      {
        "name": "Gull Point",
        "need": 3,
        "x": 50,
        "y": 14,
        "backup": true
      },
      {
        "name": "North Light",
        "need": 2,
        "x": 86,
        "y": 18,
        "backup": false
      },
      {
        "name": "Shell Cove",
        "need": 2,
        "x": 14,
        "y": 48,
        "backup": false
      },
      {
        "name": "Port Haven",
        "need": 2,
        "x": 50,
        "y": 46,
        "backup": false
      },
      {
        "name": "Rock House",
        "need": 2,
        "x": 86,
        "y": 48,
        "backup": false
      },
      {
        "name": "Sea Garden",
        "need": 2,
        "x": 14,
        "y": 78,
        "backup": false
      },
      {
        "name": "East Pier",
        "need": 2,
        "x": 50,
        "y": 78,
        "backup": false
      },
      {
        "name": "Star Island",
        "need": 1,
        "x": 86,
        "y": 78,
        "backup": false
      }
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        3,
        4
      ],
      [
        4,
        5
      ],
      [
        6,
        7
      ],
      [
        7,
        8
      ],
      [
        0,
        3
      ],
      [
        3,
        6
      ],
      [
        1,
        4
      ],
      [
        4,
        7
      ],
      [
        2,
        5
      ],
      [
        5,
        8
      ],
      [
        0,
        4
      ],
      [
        2,
        4
      ],
      [
        5,
        7
      ]
    ],
    "walkthrough": "Gull Point needs 3 more connections, with exactly 3 available. Each is required. Connect Beacon HQ–Gull Point.\n\nGull Point needs 2 more connections, with exactly 2 available. Each is required. Connect Gull Point–North Light.\n\nGull Point needs 1 more connection, with exactly 1 available. Each is required. Connect Gull Point–Port Haven.\n\nSea Garden needs 2 more connections, with exactly 2 available. Each is required. Connect Sea Garden–East Pier.\n\nSea Garden needs 1 more connection, with exactly 1 available. Each is required. Connect Shell Cove–Sea Garden.\n\nShell Cove ↔ Port Haven must stay inactive. The opposite choice forces Port Haven to exceed its count. Rule out Shell Cove–Port Haven.\n\nShell Cove needs 1 more connection, with exactly 1 available. Each is required. Connect Beacon HQ–Shell Cove.\n\nBeacon HQ already has all its connections. Its remaining links can be ruled out. Rule out Beacon HQ–Port Haven.\n\nPort Haven ↔ Rock House must stay inactive. The opposite choice forces Gull Point behind a single vulnerable link. A backup route must survive any one link failing. Rule out Port Haven–Rock House.\n\nEast Pier ↔ Star Island must stay inactive. The opposite choice forces Gull Point behind a single vulnerable link. A backup route must survive any one link failing. Rule out East Pier–Star Island.\n\nStar Island needs 1 more connection, with exactly 1 available. Each is required. Connect Rock House–Star Island.\n\nPort Haven ↔ East Pier must connect. The opposite choice forces Gull Point behind a single vulnerable link. A backup route must survive any one link failing. Connect Port Haven–East Pier.\n\nPort Haven already has all its connections. Its remaining links can be ruled out. Rule out North Light–Port Haven.\n\nNorth Light needs 1 more connection, with exactly 1 available. Each is required. Connect North Light–Rock House.",
    "reasoningSteps": 4
  },
  {
    "region": 4,
    "title": "The gull circuit",
    "intro": "Rock House needs backup. Keep it connected if any single link fails.",
    "difficulty": "Expert",
    "nodes": [
      {
        "name": "Beacon HQ",
        "need": 2,
        "x": 14,
        "y": 17,
        "backup": false
      },
      {
        "name": "Gull Point",
        "need": 3,
        "x": 50,
        "y": 14,
        "backup": false
      },
      {
        "name": "North Light",
        "need": 1,
        "x": 86,
        "y": 18,
        "backup": false
      },
      {
        "name": "Shell Cove",
        "need": 3,
        "x": 14,
        "y": 48,
        "backup": false
      },
      {
        "name": "Port Haven",
        "need": 2,
        "x": 50,
        "y": 46,
        "backup": false
      },
      {
        "name": "Rock House",
        "need": 2,
        "x": 86,
        "y": 48,
        "backup": true
      },
      {
        "name": "Sea Garden",
        "need": 2,
        "x": 14,
        "y": 78,
        "backup": false
      },
      {
        "name": "East Pier",
        "need": 3,
        "x": 50,
        "y": 78,
        "backup": false
      },
      {
        "name": "Star Island",
        "need": 2,
        "x": 86,
        "y": 78,
        "backup": false
      }
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        3,
        4
      ],
      [
        4,
        5
      ],
      [
        6,
        7
      ],
      [
        7,
        8
      ],
      [
        0,
        3
      ],
      [
        3,
        6
      ],
      [
        1,
        4
      ],
      [
        4,
        7
      ],
      [
        2,
        5
      ],
      [
        5,
        8
      ],
      [
        1,
        3
      ],
      [
        3,
        7
      ],
      [
        5,
        7
      ]
    ],
    "walkthrough": "Beacon HQ needs 2 more connections, with exactly 2 available. Each is required. Connect Beacon HQ–Gull Point.\n\nBeacon HQ needs 1 more connection, with exactly 1 available. Each is required. Connect Beacon HQ–Shell Cove.\n\nSea Garden needs 2 more connections, with exactly 2 available. Each is required. Connect Sea Garden–East Pier.\n\nSea Garden needs 1 more connection, with exactly 1 available. Each is required. Connect Shell Cove–Sea Garden.\n\nStar Island needs 2 more connections, with exactly 2 available. Each is required. Connect East Pier–Star Island.\n\nStar Island needs 1 more connection, with exactly 1 available. Each is required. Connect Rock House–Star Island.\n\nGull Point ↔ North Light must connect. The opposite choice forces Rock House behind a single vulnerable link. A backup route must survive any one link failing. Connect Gull Point–North Light.\n\nNorth Light already has all its connections. Its remaining links can be ruled out. Rule out North Light–Rock House.\n\nShell Cove ↔ Port Haven must stay inactive. The opposite choice forces Rock House behind a single vulnerable link. A backup route must survive any one link failing. Rule out Shell Cove–Port Haven.\n\nPort Haven ↔ Rock House must connect. The opposite choice forces East Pier to exceed its count. Connect Port Haven–Rock House.\n\nRock House already has all its connections. Its remaining links can be ruled out. Rule out Rock House–East Pier.\n\nGull Point ↔ Port Haven must connect. The opposite choice forces Rock House behind a single vulnerable link. A backup route must survive any one link failing. Connect Gull Point–Port Haven.\n\nGull Point already has all its connections. Its remaining links can be ruled out. Rule out Gull Point–Shell Cove.\n\nShell Cove needs 1 more connection, with exactly 1 available. Each is required. Connect Shell Cove–East Pier.",
    "reasoningSteps": 4
  },
  {
    "region": 4,
    "title": "Between islands",
    "intro": "Port Haven needs backup. Keep it connected if any single link fails.",
    "difficulty": "Expert",
    "nodes": [
      {
        "name": "Beacon HQ",
        "need": 2,
        "x": 14,
        "y": 17,
        "backup": false
      },
      {
        "name": "Gull Point",
        "need": 3,
        "x": 50,
        "y": 14,
        "backup": false
      },
      {
        "name": "North Light",
        "need": 2,
        "x": 86,
        "y": 18,
        "backup": false
      },
      {
        "name": "Shell Cove",
        "need": 2,
        "x": 14,
        "y": 48,
        "backup": false
      },
      {
        "name": "Port Haven",
        "need": 2,
        "x": 50,
        "y": 46,
        "backup": true
      },
      {
        "name": "Rock House",
        "need": 2,
        "x": 86,
        "y": 48,
        "backup": false
      },
      {
        "name": "Sea Garden",
        "need": 1,
        "x": 14,
        "y": 78,
        "backup": false
      },
      {
        "name": "East Pier",
        "need": 3,
        "x": 50,
        "y": 78,
        "backup": false
      },
      {
        "name": "Star Island",
        "need": 1,
        "x": 86,
        "y": 78,
        "backup": false
      }
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        3,
        4
      ],
      [
        4,
        5
      ],
      [
        6,
        7
      ],
      [
        7,
        8
      ],
      [
        0,
        3
      ],
      [
        3,
        6
      ],
      [
        1,
        4
      ],
      [
        4,
        7
      ],
      [
        2,
        5
      ],
      [
        5,
        8
      ],
      [
        1,
        3
      ],
      [
        1,
        5
      ],
      [
        5,
        7
      ]
    ],
    "walkthrough": "Beacon HQ needs 2 more connections, with exactly 2 available. Each is required. Connect Beacon HQ–Gull Point.\n\nBeacon HQ needs 1 more connection, with exactly 1 available. Each is required. Connect Beacon HQ–Shell Cove.\n\nNorth Light needs 2 more connections, with exactly 2 available. Each is required. Connect Gull Point–North Light.\n\nNorth Light needs 1 more connection, with exactly 1 available. Each is required. Connect North Light–Rock House.\n\nShell Cove ↔ Port Haven must connect. Following the opposite choice through every remaining count leaves no network that reaches HQ with the required backup routes. Connect Shell Cove–Port Haven.\n\nShell Cove already has all its connections. Its remaining links can be ruled out. Rule out Shell Cove–Sea Garden.\n\nShell Cove already has all its connections. Its remaining links can be ruled out. Rule out Gull Point–Shell Cove.\n\nSea Garden needs 1 more connection, with exactly 1 available. Each is required. Connect Sea Garden–East Pier.\n\nPort Haven ↔ Rock House must stay inactive. The opposite choice forces Rock House to exceed its count. Rule out Port Haven–Rock House.\n\nEast Pier ↔ Star Island must connect. The opposite choice forces Rock House to exceed its count. Connect East Pier–Star Island.\n\nStar Island already has all its connections. Its remaining links can be ruled out. Rule out Rock House–Star Island.\n\nGull Point ↔ Port Haven must connect. The opposite choice forces Port Haven behind a single vulnerable link. A backup route must survive any one link failing. Connect Gull Point–Port Haven.\n\nGull Point already has all its connections. Its remaining links can be ruled out. Rule out Gull Point–Rock House.\n\nPort Haven already has all its connections. Its remaining links can be ruled out. Rule out Port Haven–East Pier.\n\nRock House needs 1 more connection, with exactly 1 available. Each is required. Connect Rock House–East Pier.",
    "reasoningSteps": 4
  },
  {
    "region": 4,
    "title": "Port of call",
    "intro": "Gull Point needs backup. Keep it connected if any single link fails.",
    "difficulty": "Expert",
    "nodes": [
      {
        "name": "Beacon HQ",
        "need": 2,
        "x": 14,
        "y": 17,
        "backup": false
      },
      {
        "name": "Gull Point",
        "need": 2,
        "x": 50,
        "y": 14,
        "backup": true
      },
      {
        "name": "North Light",
        "need": 2,
        "x": 86,
        "y": 18,
        "backup": false
      },
      {
        "name": "Shell Cove",
        "need": 1,
        "x": 14,
        "y": 48,
        "backup": false
      },
      {
        "name": "Port Haven",
        "need": 2,
        "x": 50,
        "y": 46,
        "backup": false
      },
      {
        "name": "Rock House",
        "need": 3,
        "x": 86,
        "y": 48,
        "backup": false
      },
      {
        "name": "Sea Garden",
        "need": 2,
        "x": 14,
        "y": 78,
        "backup": false
      },
      {
        "name": "East Pier",
        "need": 2,
        "x": 50,
        "y": 78,
        "backup": false
      },
      {
        "name": "Star Island",
        "need": 2,
        "x": 86,
        "y": 78,
        "backup": false
      }
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        3,
        4
      ],
      [
        4,
        5
      ],
      [
        6,
        7
      ],
      [
        7,
        8
      ],
      [
        0,
        3
      ],
      [
        3,
        6
      ],
      [
        1,
        4
      ],
      [
        4,
        7
      ],
      [
        2,
        5
      ],
      [
        5,
        8
      ],
      [
        0,
        4
      ],
      [
        4,
        6
      ],
      [
        5,
        7
      ]
    ],
    "walkthrough": "North Light needs 2 more connections, with exactly 2 available. Each is required. Connect Gull Point–North Light.\n\nNorth Light needs 1 more connection, with exactly 1 available. Each is required. Connect North Light–Rock House.\n\nStar Island needs 2 more connections, with exactly 2 available. Each is required. Connect East Pier–Star Island.\n\nStar Island needs 1 more connection, with exactly 1 available. Each is required. Connect Rock House–Star Island.\n\nBeacon HQ ↔ Gull Point must connect. The opposite choice forces Gull Point behind a single vulnerable link. A backup route must survive any one link failing. Connect Beacon HQ–Gull Point.\n\nGull Point already has all its connections. Its remaining links can be ruled out. Rule out Gull Point–Port Haven.\n\nShell Cove ↔ Port Haven must stay inactive. The opposite choice forces Gull Point behind a single vulnerable link. A backup route must survive any one link failing. Rule out Shell Cove–Port Haven.\n\nPort Haven ↔ Rock House must connect. The opposite choice forces Gull Point behind a single vulnerable link. A backup route must survive any one link failing. Connect Port Haven–Rock House.\n\nRock House already has all its connections. Its remaining links can be ruled out. Rule out Rock House–East Pier.\n\nSea Garden ↔ East Pier must connect. The opposite choice forces Port Haven to exceed its count. Connect Sea Garden–East Pier.\n\nEast Pier already has all its connections. Its remaining links can be ruled out. Rule out Port Haven–East Pier.\n\nBeacon HQ ↔ Shell Cove must stay inactive. The opposite choice forces Gull Point behind a single vulnerable link. A backup route must survive any one link failing. Rule out Beacon HQ–Shell Cove.\n\nBeacon HQ needs 1 more connection, with exactly 1 available. Each is required. Connect Beacon HQ–Port Haven.\n\nShell Cove needs 1 more connection, with exactly 1 available. Each is required. Connect Shell Cove–Sea Garden.",
    "reasoningSteps": 5
  },
  {
    "region": 4,
    "title": "Two lights home",
    "intro": "Gull Point needs backup. Keep it connected if any single link fails.",
    "difficulty": "Expert",
    "nodes": [
      {
        "name": "Beacon HQ",
        "need": 2,
        "x": 14,
        "y": 17,
        "backup": false
      },
      {
        "name": "Gull Point",
        "need": 3,
        "x": 50,
        "y": 14,
        "backup": true
      },
      {
        "name": "North Light",
        "need": 2,
        "x": 86,
        "y": 18,
        "backup": false
      },
      {
        "name": "Shell Cove",
        "need": 2,
        "x": 14,
        "y": 48,
        "backup": false
      },
      {
        "name": "Port Haven",
        "need": 2,
        "x": 50,
        "y": 46,
        "backup": false
      },
      {
        "name": "Rock House",
        "need": 2,
        "x": 86,
        "y": 48,
        "backup": false
      },
      {
        "name": "Sea Garden",
        "need": 2,
        "x": 14,
        "y": 78,
        "backup": false
      },
      {
        "name": "East Pier",
        "need": 2,
        "x": 50,
        "y": 78,
        "backup": false
      },
      {
        "name": "Star Island",
        "need": 1,
        "x": 86,
        "y": 78,
        "backup": false
      }
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        3,
        4
      ],
      [
        4,
        5
      ],
      [
        6,
        7
      ],
      [
        7,
        8
      ],
      [
        0,
        3
      ],
      [
        3,
        6
      ],
      [
        1,
        4
      ],
      [
        4,
        7
      ],
      [
        2,
        5
      ],
      [
        5,
        8
      ],
      [
        0,
        4
      ],
      [
        1,
        5
      ],
      [
        4,
        8
      ]
    ],
    "walkthrough": "North Light needs 2 more connections, with exactly 2 available. Each is required. Connect Gull Point–North Light.\n\nNorth Light needs 1 more connection, with exactly 1 available. Each is required. Connect North Light–Rock House.\n\nSea Garden needs 2 more connections, with exactly 2 available. Each is required. Connect Sea Garden–East Pier.\n\nSea Garden needs 1 more connection, with exactly 1 available. Each is required. Connect Shell Cove–Sea Garden.\n\nBeacon HQ ↔ Gull Point must connect. The opposite choice forces Gull Point behind a single vulnerable link. A backup route must survive any one link failing. Connect Beacon HQ–Gull Point.\n\nShell Cove ↔ Port Haven must stay inactive. The opposite choice forces Gull Point behind a single vulnerable link. A backup route must survive any one link failing. Rule out Shell Cove–Port Haven.\n\nShell Cove needs 1 more connection, with exactly 1 available. Each is required. Connect Beacon HQ–Shell Cove.\n\nBeacon HQ already has all its connections. Its remaining links can be ruled out. Rule out Beacon HQ–Port Haven.\n\nPort Haven ↔ Rock House must stay inactive. The opposite choice forces Gull Point behind a single vulnerable link. A backup route must survive any one link failing. Rule out Port Haven–Rock House.\n\nEast Pier ↔ Star Island must stay inactive. The opposite choice forces Star Island to exceed its count. Rule out East Pier–Star Island.\n\nEast Pier needs 1 more connection, with exactly 1 available. Each is required. Connect Port Haven–East Pier.\n\nGull Point ↔ Port Haven must connect. The opposite choice forces Gull Point behind a single vulnerable link. A backup route must survive any one link failing. Connect Gull Point–Port Haven.\n\nGull Point already has all its connections. Its remaining links can be ruled out. Rule out Gull Point–Rock House.\n\nPort Haven already has all its connections. Its remaining links can be ruled out. Rule out Port Haven–Star Island.\n\nRock House needs 1 more connection, with exactly 1 available. Each is required. Connect Rock House–Star Island.",
    "reasoningSteps": 5
  },
  {
    "region": 4,
    "title": "The outer islands",
    "intro": "Star Island needs backup. Keep it connected if any single link fails.",
    "difficulty": "Expert",
    "nodes": [
      {
        "name": "Beacon HQ",
        "need": 2,
        "x": 14,
        "y": 17,
        "backup": false
      },
      {
        "name": "Gull Point",
        "need": 2,
        "x": 50,
        "y": 14,
        "backup": false
      },
      {
        "name": "North Light",
        "need": 1,
        "x": 86,
        "y": 18,
        "backup": false
      },
      {
        "name": "Shell Cove",
        "need": 2,
        "x": 14,
        "y": 48,
        "backup": false
      },
      {
        "name": "Port Haven",
        "need": 3,
        "x": 50,
        "y": 46,
        "backup": false
      },
      {
        "name": "Rock House",
        "need": 2,
        "x": 86,
        "y": 48,
        "backup": false
      },
      {
        "name": "Sea Garden",
        "need": 1,
        "x": 14,
        "y": 78,
        "backup": false
      },
      {
        "name": "East Pier",
        "need": 3,
        "x": 50,
        "y": 78,
        "backup": false
      },
      {
        "name": "Star Island",
        "need": 2,
        "x": 86,
        "y": 78,
        "backup": true
      }
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        3,
        4
      ],
      [
        4,
        5
      ],
      [
        6,
        7
      ],
      [
        7,
        8
      ],
      [
        0,
        3
      ],
      [
        3,
        6
      ],
      [
        1,
        4
      ],
      [
        4,
        7
      ],
      [
        2,
        5
      ],
      [
        5,
        8
      ],
      [
        1,
        3
      ],
      [
        3,
        7
      ],
      [
        4,
        8
      ]
    ],
    "walkthrough": "Beacon HQ needs 2 more connections, with exactly 2 available. Each is required. Connect Beacon HQ–Gull Point.\n\nBeacon HQ needs 1 more connection, with exactly 1 available. Each is required. Connect Beacon HQ–Shell Cove.\n\nGull Point ↔ North Light must stay inactive. The opposite choice forces Star Island behind a single vulnerable link. A backup route must survive any one link failing. Rule out Gull Point–North Light.\n\nNorth Light needs 1 more connection, with exactly 1 available. Each is required. Connect North Light–Rock House.\n\nShell Cove ↔ Port Haven must stay inactive. The opposite choice forces Star Island behind a single vulnerable link. A backup route must survive any one link failing. Rule out Shell Cove–Port Haven.\n\nPort Haven ↔ Rock House must connect. The opposite choice forces Star Island behind a single vulnerable link. A backup route must survive any one link failing. Connect Port Haven–Rock House.\n\nRock House already has all its connections. Its remaining links can be ruled out. Rule out Rock House–Star Island.\n\nStar Island needs 2 more connections, with exactly 2 available. Each is required. Connect East Pier–Star Island.\n\nStar Island needs 1 more connection, with exactly 1 available. Each is required. Connect Port Haven–Star Island.\n\nSea Garden ↔ East Pier must connect. The opposite choice forces Star Island behind a single vulnerable link. A backup route must survive any one link failing. Connect Sea Garden–East Pier.\n\nSea Garden already has all its connections. Its remaining links can be ruled out. Rule out Shell Cove–Sea Garden.\n\nGull Point ↔ Port Haven must connect. The opposite choice forces Star Island behind a single vulnerable link. A backup route must survive any one link failing. Connect Gull Point–Port Haven.\n\nGull Point already has all its connections. Its remaining links can be ruled out. Rule out Gull Point–Shell Cove.\n\nShell Cove needs 1 more connection, with exactly 1 available. Each is required. Connect Shell Cove–East Pier.",
    "reasoningSteps": 5
  },
  {
    "region": 4,
    "title": "A beacon in the fog",
    "intro": "Rock House needs backup. Keep it connected if any single link fails.",
    "difficulty": "Expert",
    "nodes": [
      {
        "name": "Beacon HQ",
        "need": 2,
        "x": 14,
        "y": 17,
        "backup": false
      },
      {
        "name": "Gull Point",
        "need": 2,
        "x": 50,
        "y": 14,
        "backup": false
      },
      {
        "name": "North Light",
        "need": 1,
        "x": 86,
        "y": 18,
        "backup": false
      },
      {
        "name": "Shell Cove",
        "need": 3,
        "x": 14,
        "y": 48,
        "backup": false
      },
      {
        "name": "Port Haven",
        "need": 3,
        "x": 50,
        "y": 46,
        "backup": false
      },
      {
        "name": "Rock House",
        "need": 3,
        "x": 86,
        "y": 48,
        "backup": true
      },
      {
        "name": "Sea Garden",
        "need": 1,
        "x": 14,
        "y": 78,
        "backup": false
      },
      {
        "name": "East Pier",
        "need": 2,
        "x": 50,
        "y": 78,
        "backup": false
      },
      {
        "name": "Star Island",
        "need": 1,
        "x": 86,
        "y": 78,
        "backup": false
      }
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        3,
        4
      ],
      [
        4,
        5
      ],
      [
        6,
        7
      ],
      [
        7,
        8
      ],
      [
        0,
        3
      ],
      [
        3,
        6
      ],
      [
        1,
        4
      ],
      [
        4,
        7
      ],
      [
        2,
        5
      ],
      [
        5,
        8
      ],
      [
        1,
        5
      ],
      [
        3,
        7
      ]
    ],
    "walkthrough": "Beacon HQ needs 2 more connections, with exactly 2 available. Each is required. Connect Beacon HQ–Gull Point.\n\nBeacon HQ needs 1 more connection, with exactly 1 available. Each is required. Connect Beacon HQ–Shell Cove.\n\nGull Point ↔ North Light must stay inactive. The opposite choice forces Rock House behind a single vulnerable link. A backup route must survive any one link failing. Rule out Gull Point–North Light.\n\nNorth Light needs 1 more connection, with exactly 1 available. Each is required. Connect North Light–Rock House.\n\nShell Cove ↔ Port Haven must connect. The opposite choice forces Rock House behind a single vulnerable link. A backup route must survive any one link failing. Connect Shell Cove–Port Haven.\n\nPort Haven ↔ Rock House must connect. The opposite choice forces Rock House behind a single vulnerable link. A backup route must survive any one link failing. Connect Port Haven–Rock House.\n\nSea Garden ↔ East Pier must stay inactive. The opposite choice forces Rock House behind a single vulnerable link. A backup route must survive any one link failing. Rule out Sea Garden–East Pier.\n\nSea Garden needs 1 more connection, with exactly 1 available. Each is required. Connect Shell Cove–Sea Garden.\n\nShell Cove already has all its connections. Its remaining links can be ruled out. Rule out Shell Cove–East Pier.\n\nEast Pier needs 2 more connections, with exactly 2 available. Each is required. Connect East Pier–Star Island.\n\nEast Pier needs 1 more connection, with exactly 1 available. Each is required. Connect Port Haven–East Pier.\n\nPort Haven already has all its connections. Its remaining links can be ruled out. Rule out Gull Point–Port Haven.\n\nGull Point needs 1 more connection, with exactly 1 available. Each is required. Connect Gull Point–Rock House.",
    "reasoningSteps": 4
  },
  {
    "region": 5,
    "title": "First frost",
    "intro": "Snow Lodge needs backup. Keep it connected if any single link fails.",
    "difficulty": "Expert",
    "nodes": [
      {
        "name": "Aurora HQ",
        "need": 2,
        "x": 14,
        "y": 17,
        "backup": false
      },
      {
        "name": "Frost Camp",
        "need": 3,
        "x": 50,
        "y": 14,
        "backup": false
      },
      {
        "name": "Ice Light",
        "need": 2,
        "x": 86,
        "y": 18,
        "backup": false
      },
      {
        "name": "Snow Lodge",
        "need": 2,
        "x": 14,
        "y": 48,
        "backup": true
      },
      {
        "name": "North Gate",
        "need": 3,
        "x": 50,
        "y": 46,
        "backup": false
      },
      {
        "name": "Stone Hut",
        "need": 2,
        "x": 86,
        "y": 48,
        "backup": false
      },
      {
        "name": "Glacier End",
        "need": 1,
        "x": 14,
        "y": 78,
        "backup": false
      },
      {
        "name": "Lake Ferry",
        "need": 2,
        "x": 50,
        "y": 78,
        "backup": false
      },
      {
        "name": "Polar Watch",
        "need": 1,
        "x": 86,
        "y": 78,
        "backup": false
      }
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        3,
        4
      ],
      [
        4,
        5
      ],
      [
        6,
        7
      ],
      [
        7,
        8
      ],
      [
        0,
        3
      ],
      [
        3,
        6
      ],
      [
        1,
        4
      ],
      [
        4,
        7
      ],
      [
        2,
        5
      ],
      [
        5,
        8
      ],
      [
        0,
        4
      ],
      [
        3,
        7
      ],
      [
        5,
        7
      ]
    ],
    "walkthrough": "Frost Camp needs 3 more connections, with exactly 3 available. Each is required. Connect Aurora HQ–Frost Camp.\n\nFrost Camp needs 2 more connections, with exactly 2 available. Each is required. Connect Frost Camp–Ice Light.\n\nFrost Camp needs 1 more connection, with exactly 1 available. Each is required. Connect Frost Camp–North Gate.\n\nIce Light needs 1 more connection, with exactly 1 available. Each is required. Connect Ice Light–Stone Hut.\n\nSnow Lodge ↔ North Gate must connect. Following the opposite choice through every remaining count leaves no network that reaches HQ with the required backup routes. Connect Snow Lodge–North Gate.\n\nNorth Gate ↔ Stone Hut must stay inactive. The opposite choice, followed through the station counts, cuts Glacier End off from HQ. Rule out North Gate–Stone Hut.\n\nGlacier End ↔ Lake Ferry must connect. The opposite choice forces Snow Lodge behind a single vulnerable link. A backup route must survive any one link failing. Connect Glacier End–Lake Ferry.\n\nGlacier End already has all its connections. Its remaining links can be ruled out. Rule out Snow Lodge–Glacier End.\n\nLake Ferry ↔ Polar Watch must stay inactive. The opposite choice forces North Gate to run out of available links. Rule out Lake Ferry–Polar Watch.\n\nPolar Watch needs 1 more connection, with exactly 1 available. Each is required. Connect Stone Hut–Polar Watch.\n\nStone Hut already has all its connections. Its remaining links can be ruled out. Rule out Stone Hut–Lake Ferry.\n\nAurora HQ ↔ Snow Lodge must connect. The opposite choice forces Snow Lodge behind a single vulnerable link. A backup route must survive any one link failing. Connect Aurora HQ–Snow Lodge.\n\nAurora HQ already has all its connections. Its remaining links can be ruled out. Rule out Aurora HQ–North Gate.\n\nSnow Lodge already has all its connections. Its remaining links can be ruled out. Rule out Snow Lodge–Lake Ferry.\n\nNorth Gate needs 1 more connection, with exactly 1 available. Each is required. Connect North Gate–Lake Ferry.",
    "reasoningSteps": 5
  },
  {
    "region": 5,
    "title": "The snow line",
    "intro": "Frost Camp needs backup. Keep it connected if any single link fails.",
    "difficulty": "Expert",
    "nodes": [
      {
        "name": "Aurora HQ",
        "need": 2,
        "x": 14,
        "y": 17,
        "backup": false
      },
      {
        "name": "Frost Camp",
        "need": 2,
        "x": 50,
        "y": 14,
        "backup": true
      },
      {
        "name": "Ice Light",
        "need": 1,
        "x": 86,
        "y": 18,
        "backup": false
      },
      {
        "name": "Snow Lodge",
        "need": 3,
        "x": 14,
        "y": 48,
        "backup": false
      },
      {
        "name": "North Gate",
        "need": 3,
        "x": 50,
        "y": 46,
        "backup": false
      },
      {
        "name": "Stone Hut",
        "need": 1,
        "x": 86,
        "y": 48,
        "backup": false
      },
      {
        "name": "Glacier End",
        "need": 2,
        "x": 14,
        "y": 78,
        "backup": false
      },
      {
        "name": "Lake Ferry",
        "need": 3,
        "x": 50,
        "y": 78,
        "backup": false
      },
      {
        "name": "Polar Watch",
        "need": 1,
        "x": 86,
        "y": 78,
        "backup": false
      }
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        3,
        4
      ],
      [
        4,
        5
      ],
      [
        6,
        7
      ],
      [
        7,
        8
      ],
      [
        0,
        3
      ],
      [
        3,
        6
      ],
      [
        1,
        4
      ],
      [
        4,
        7
      ],
      [
        2,
        5
      ],
      [
        5,
        8
      ],
      [
        0,
        4
      ],
      [
        2,
        4
      ],
      [
        5,
        7
      ]
    ],
    "walkthrough": "Snow Lodge needs 3 more connections, with exactly 3 available. Each is required. Connect Snow Lodge–North Gate.\n\nSnow Lodge needs 2 more connections, with exactly 2 available. Each is required. Connect Aurora HQ–Snow Lodge.\n\nSnow Lodge needs 1 more connection, with exactly 1 available. Each is required. Connect Snow Lodge–Glacier End.\n\nGlacier End needs 1 more connection, with exactly 1 available. Each is required. Connect Glacier End–Lake Ferry.\n\nAurora HQ ↔ Frost Camp must connect. The opposite choice forces Frost Camp behind a single vulnerable link. A backup route must survive any one link failing. Connect Aurora HQ–Frost Camp.\n\nAurora HQ already has all its connections. Its remaining links can be ruled out. Rule out Aurora HQ–North Gate.\n\nFrost Camp ↔ Ice Light must stay inactive. The opposite choice forces Frost Camp behind a single vulnerable link. A backup route must survive any one link failing. Rule out Frost Camp–Ice Light.\n\nFrost Camp needs 1 more connection, with exactly 1 available. Each is required. Connect Frost Camp–North Gate.\n\nNorth Gate ↔ Stone Hut must stay inactive. The opposite choice forces Stone Hut to exceed its count. Rule out North Gate–Stone Hut.\n\nLake Ferry ↔ Polar Watch must connect. The opposite choice forces Stone Hut to exceed its count. Connect Lake Ferry–Polar Watch.\n\nPolar Watch already has all its connections. Its remaining links can be ruled out. Rule out Stone Hut–Polar Watch.\n\nNorth Gate ↔ Lake Ferry must stay inactive. The opposite choice, followed through the station counts, cuts Ice Light off from HQ. Rule out North Gate–Lake Ferry.\n\nNorth Gate needs 1 more connection, with exactly 1 available. Each is required. Connect Ice Light–North Gate.\n\nIce Light already has all its connections. Its remaining links can be ruled out. Rule out Ice Light–Stone Hut.\n\nStone Hut needs 1 more connection, with exactly 1 available. Each is required. Connect Stone Hut–Lake Ferry.",
    "reasoningSteps": 5
  },
  {
    "region": 5,
    "title": "Aurora calling",
    "intro": "North Gate needs backup. Keep it connected if any single link fails.",
    "difficulty": "Expert",
    "nodes": [
      {
        "name": "Aurora HQ",
        "need": 2,
        "x": 14,
        "y": 17,
        "backup": false
      },
      {
        "name": "Frost Camp",
        "need": 2,
        "x": 50,
        "y": 14,
        "backup": false
      },
      {
        "name": "Ice Light",
        "need": 1,
        "x": 86,
        "y": 18,
        "backup": false
      },
      {
        "name": "Snow Lodge",
        "need": 4,
        "x": 14,
        "y": 48,
        "backup": false
      },
      {
        "name": "North Gate",
        "need": 3,
        "x": 50,
        "y": 46,
        "backup": true
      },
      {
        "name": "Stone Hut",
        "need": 2,
        "x": 86,
        "y": 48,
        "backup": false
      },
      {
        "name": "Glacier End",
        "need": 1,
        "x": 14,
        "y": 78,
        "backup": false
      },
      {
        "name": "Lake Ferry",
        "need": 2,
        "x": 50,
        "y": 78,
        "backup": false
      },
      {
        "name": "Polar Watch",
        "need": 1,
        "x": 86,
        "y": 78,
        "backup": false
      }
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        3,
        4
      ],
      [
        4,
        5
      ],
      [
        6,
        7
      ],
      [
        7,
        8
      ],
      [
        0,
        3
      ],
      [
        3,
        6
      ],
      [
        1,
        4
      ],
      [
        4,
        7
      ],
      [
        2,
        5
      ],
      [
        5,
        8
      ],
      [
        1,
        3
      ],
      [
        3,
        7
      ],
      [
        5,
        7
      ]
    ],
    "walkthrough": "Aurora HQ needs 2 more connections, with exactly 2 available. Each is required. Connect Aurora HQ–Frost Camp.\n\nAurora HQ needs 1 more connection, with exactly 1 available. Each is required. Connect Aurora HQ–Snow Lodge.\n\nFrost Camp ↔ Ice Light must stay inactive. The opposite choice forces North Gate behind a single vulnerable link. A backup route must survive any one link failing. Rule out Frost Camp–Ice Light.\n\nIce Light needs 1 more connection, with exactly 1 available. Each is required. Connect Ice Light–Stone Hut.\n\nSnow Lodge ↔ North Gate must connect. The opposite choice forces North Gate to run out of available links. Connect Snow Lodge–North Gate.\n\nNorth Gate ↔ Stone Hut must connect. The opposite choice, followed through the station counts, cuts Ice Light off from HQ. Connect North Gate–Stone Hut.\n\nStone Hut already has all its connections. Its remaining links can be ruled out. Rule out Stone Hut–Polar Watch.\n\nStone Hut already has all its connections. Its remaining links can be ruled out. Rule out Stone Hut–Lake Ferry.\n\nPolar Watch needs 1 more connection, with exactly 1 available. Each is required. Connect Lake Ferry–Polar Watch.\n\nGlacier End ↔ Lake Ferry must stay inactive. The opposite choice forces Lake Ferry to exceed its count. Rule out Glacier End–Lake Ferry.\n\nGlacier End needs 1 more connection, with exactly 1 available. Each is required. Connect Snow Lodge–Glacier End.\n\nFrost Camp ↔ North Gate must connect. The opposite choice forces North Gate behind a single vulnerable link. A backup route must survive any one link failing. Connect Frost Camp–North Gate.\n\nFrost Camp already has all its connections. Its remaining links can be ruled out. Rule out Frost Camp–Snow Lodge.\n\nSnow Lodge needs 1 more connection, with exactly 1 available. Each is required. Connect Snow Lodge–Lake Ferry.",
    "reasoningSteps": 5
  },
  {
    "region": 5,
    "title": "Beyond the lake",
    "intro": "North Gate needs backup. Keep it connected if any single link fails.",
    "difficulty": "Expert",
    "nodes": [
      {
        "name": "Aurora HQ",
        "need": 2,
        "x": 14,
        "y": 17,
        "backup": false
      },
      {
        "name": "Frost Camp",
        "need": 3,
        "x": 50,
        "y": 14,
        "backup": false
      },
      {
        "name": "Ice Light",
        "need": 1,
        "x": 86,
        "y": 18,
        "backup": false
      },
      {
        "name": "Snow Lodge",
        "need": 3,
        "x": 14,
        "y": 48,
        "backup": false
      },
      {
        "name": "North Gate",
        "need": 2,
        "x": 50,
        "y": 46,
        "backup": true
      },
      {
        "name": "Stone Hut",
        "need": 1,
        "x": 86,
        "y": 48,
        "backup": false
      },
      {
        "name": "Glacier End",
        "need": 2,
        "x": 14,
        "y": 78,
        "backup": false
      },
      {
        "name": "Lake Ferry",
        "need": 3,
        "x": 50,
        "y": 78,
        "backup": false
      },
      {
        "name": "Polar Watch",
        "need": 1,
        "x": 86,
        "y": 78,
        "backup": false
      }
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        3,
        4
      ],
      [
        4,
        5
      ],
      [
        6,
        7
      ],
      [
        7,
        8
      ],
      [
        0,
        3
      ],
      [
        3,
        6
      ],
      [
        1,
        4
      ],
      [
        4,
        7
      ],
      [
        2,
        5
      ],
      [
        5,
        8
      ],
      [
        1,
        3
      ],
      [
        1,
        5
      ],
      [
        5,
        7
      ]
    ],
    "walkthrough": "Aurora HQ needs 2 more connections, with exactly 2 available. Each is required. Connect Aurora HQ–Frost Camp.\n\nAurora HQ needs 1 more connection, with exactly 1 available. Each is required. Connect Aurora HQ–Snow Lodge.\n\nGlacier End needs 2 more connections, with exactly 2 available. Each is required. Connect Glacier End–Lake Ferry.\n\nGlacier End needs 1 more connection, with exactly 1 available. Each is required. Connect Snow Lodge–Glacier End.\n\nFrost Camp ↔ Ice Light must connect. The opposite choice, followed through the station counts, cuts Ice Light off from HQ. Connect Frost Camp–Ice Light.\n\nIce Light already has all its connections. Its remaining links can be ruled out. Rule out Ice Light–Stone Hut.\n\nSnow Lodge ↔ North Gate must connect. The opposite choice forces North Gate behind a single vulnerable link. A backup route must survive any one link failing. Connect Snow Lodge–North Gate.\n\nSnow Lodge already has all its connections. Its remaining links can be ruled out. Rule out Frost Camp–Snow Lodge.\n\nNorth Gate ↔ Stone Hut must stay inactive. The opposite choice forces Stone Hut to exceed its count. Rule out North Gate–Stone Hut.\n\nLake Ferry ↔ Polar Watch must connect. The opposite choice forces Stone Hut to exceed its count. Connect Lake Ferry–Polar Watch.\n\nPolar Watch already has all its connections. Its remaining links can be ruled out. Rule out Stone Hut–Polar Watch.\n\nFrost Camp ↔ North Gate must connect. The opposite choice forces North Gate behind a single vulnerable link. A backup route must survive any one link failing. Connect Frost Camp–North Gate.\n\nFrost Camp already has all its connections. Its remaining links can be ruled out. Rule out Frost Camp–Stone Hut.\n\nNorth Gate already has all its connections. Its remaining links can be ruled out. Rule out North Gate–Lake Ferry.\n\nStone Hut needs 1 more connection, with exactly 1 available. Each is required. Connect Stone Hut–Lake Ferry.",
    "reasoningSteps": 5
  },
  {
    "region": 5,
    "title": "The glacier route",
    "intro": "Frost Camp needs backup. Keep it connected if any single link fails.",
    "difficulty": "Expert",
    "nodes": [
      {
        "name": "Aurora HQ",
        "need": 2,
        "x": 14,
        "y": 17,
        "backup": false
      },
      {
        "name": "Frost Camp",
        "need": 2,
        "x": 50,
        "y": 14,
        "backup": true
      },
      {
        "name": "Ice Light",
        "need": 1,
        "x": 86,
        "y": 18,
        "backup": false
      },
      {
        "name": "Snow Lodge",
        "need": 1,
        "x": 14,
        "y": 48,
        "backup": false
      },
      {
        "name": "North Gate",
        "need": 3,
        "x": 50,
        "y": 46,
        "backup": false
      },
      {
        "name": "Stone Hut",
        "need": 3,
        "x": 86,
        "y": 48,
        "backup": false
      },
      {
        "name": "Glacier End",
        "need": 2,
        "x": 14,
        "y": 78,
        "backup": false
      },
      {
        "name": "Lake Ferry",
        "need": 2,
        "x": 50,
        "y": 78,
        "backup": false
      },
      {
        "name": "Polar Watch",
        "need": 2,
        "x": 86,
        "y": 78,
        "backup": false
      }
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        3,
        4
      ],
      [
        4,
        5
      ],
      [
        6,
        7
      ],
      [
        7,
        8
      ],
      [
        0,
        3
      ],
      [
        3,
        6
      ],
      [
        1,
        4
      ],
      [
        4,
        7
      ],
      [
        2,
        5
      ],
      [
        5,
        8
      ],
      [
        0,
        4
      ],
      [
        4,
        6
      ],
      [
        5,
        7
      ]
    ],
    "walkthrough": "Polar Watch needs 2 more connections, with exactly 2 available. Each is required. Connect Lake Ferry–Polar Watch.\n\nPolar Watch needs 1 more connection, with exactly 1 available. Each is required. Connect Stone Hut–Polar Watch.\n\nAurora HQ ↔ Frost Camp must connect. The opposite choice forces Frost Camp behind a single vulnerable link. A backup route must survive any one link failing. Connect Aurora HQ–Frost Camp.\n\nFrost Camp ↔ Ice Light must stay inactive. The opposite choice forces Frost Camp behind a single vulnerable link. A backup route must survive any one link failing. Rule out Frost Camp–Ice Light.\n\nFrost Camp needs 1 more connection, with exactly 1 available. Each is required. Connect Frost Camp–North Gate.\n\nIce Light needs 1 more connection, with exactly 1 available. Each is required. Connect Ice Light–Stone Hut.\n\nSnow Lodge ↔ North Gate must stay inactive. The opposite choice, followed through the station counts, cuts Ice Light off from HQ. Rule out Snow Lodge–North Gate.\n\nNorth Gate ↔ Stone Hut must connect. The opposite choice, followed through the station counts, cuts Ice Light off from HQ. Connect North Gate–Stone Hut.\n\nStone Hut already has all its connections. Its remaining links can be ruled out. Rule out Stone Hut–Lake Ferry.\n\nGlacier End ↔ Lake Ferry must connect. The opposite choice forces North Gate to exceed its count. Connect Glacier End–Lake Ferry.\n\nLake Ferry already has all its connections. Its remaining links can be ruled out. Rule out North Gate–Lake Ferry.\n\nAurora HQ ↔ Snow Lodge must stay inactive. The opposite choice forces Frost Camp behind a single vulnerable link. A backup route must survive any one link failing. Rule out Aurora HQ–Snow Lodge.\n\nAurora HQ needs 1 more connection, with exactly 1 available. Each is required. Connect Aurora HQ–North Gate.\n\nSnow Lodge needs 1 more connection, with exactly 1 available. Each is required. Connect Snow Lodge–Glacier End.",
    "reasoningSteps": 6
  },
  {
    "region": 5,
    "title": "Polar connections",
    "intro": "Frost Camp needs backup. Keep it connected if any single link fails.",
    "difficulty": "Expert",
    "nodes": [
      {
        "name": "Aurora HQ",
        "need": 2,
        "x": 14,
        "y": 17,
        "backup": false
      },
      {
        "name": "Frost Camp",
        "need": 3,
        "x": 50,
        "y": 14,
        "backup": true
      },
      {
        "name": "Ice Light",
        "need": 2,
        "x": 86,
        "y": 18,
        "backup": false
      },
      {
        "name": "Snow Lodge",
        "need": 2,
        "x": 14,
        "y": 48,
        "backup": false
      },
      {
        "name": "North Gate",
        "need": 3,
        "x": 50,
        "y": 46,
        "backup": false
      },
      {
        "name": "Stone Hut",
        "need": 2,
        "x": 86,
        "y": 48,
        "backup": false
      },
      {
        "name": "Glacier End",
        "need": 1,
        "x": 14,
        "y": 78,
        "backup": false
      },
      {
        "name": "Lake Ferry",
        "need": 2,
        "x": 50,
        "y": 78,
        "backup": false
      },
      {
        "name": "Polar Watch",
        "need": 1,
        "x": 86,
        "y": 78,
        "backup": false
      }
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        3,
        4
      ],
      [
        4,
        5
      ],
      [
        6,
        7
      ],
      [
        7,
        8
      ],
      [
        0,
        3
      ],
      [
        3,
        6
      ],
      [
        1,
        4
      ],
      [
        4,
        7
      ],
      [
        2,
        5
      ],
      [
        5,
        8
      ],
      [
        0,
        4
      ],
      [
        1,
        5
      ],
      [
        4,
        8
      ]
    ],
    "walkthrough": "Ice Light needs 2 more connections, with exactly 2 available. Each is required. Connect Frost Camp–Ice Light.\n\nIce Light needs 1 more connection, with exactly 1 available. Each is required. Connect Ice Light–Stone Hut.\n\nAurora HQ ↔ Frost Camp must connect. The opposite choice forces Frost Camp behind a single vulnerable link. A backup route must survive any one link failing. Connect Aurora HQ–Frost Camp.\n\nSnow Lodge ↔ North Gate must connect. The opposite choice forces Frost Camp behind a single vulnerable link. A backup route must survive any one link failing. Connect Snow Lodge–North Gate.\n\nNorth Gate ↔ Stone Hut must stay inactive. The opposite choice, followed through the station counts, cuts Glacier End off from HQ. Rule out North Gate–Stone Hut.\n\nGlacier End ↔ Lake Ferry must connect. The opposite choice forces Frost Camp behind a single vulnerable link. A backup route must survive any one link failing. Connect Glacier End–Lake Ferry.\n\nGlacier End already has all its connections. Its remaining links can be ruled out. Rule out Snow Lodge–Glacier End.\n\nSnow Lodge needs 1 more connection, with exactly 1 available. Each is required. Connect Aurora HQ–Snow Lodge.\n\nAurora HQ already has all its connections. Its remaining links can be ruled out. Rule out Aurora HQ–North Gate.\n\nLake Ferry ↔ Polar Watch must stay inactive. The opposite choice forces Polar Watch to exceed its count. Rule out Lake Ferry–Polar Watch.\n\nLake Ferry needs 1 more connection, with exactly 1 available. Each is required. Connect North Gate–Lake Ferry.\n\nFrost Camp ↔ North Gate must connect. The opposite choice forces Frost Camp behind a single vulnerable link. A backup route must survive any one link failing. Connect Frost Camp–North Gate.\n\nFrost Camp already has all its connections. Its remaining links can be ruled out. Rule out Frost Camp–Stone Hut.\n\nNorth Gate already has all its connections. Its remaining links can be ruled out. Rule out North Gate–Polar Watch.\n\nStone Hut needs 1 more connection, with exactly 1 available. Each is required. Connect Stone Hut–Polar Watch.",
    "reasoningSteps": 6
  },
  {
    "region": 5,
    "title": "The long night",
    "intro": "North Gate needs backup. Keep it connected if any single link fails.",
    "difficulty": "Expert",
    "nodes": [
      {
        "name": "Aurora HQ",
        "need": 2,
        "x": 14,
        "y": 17,
        "backup": false
      },
      {
        "name": "Frost Camp",
        "need": 2,
        "x": 50,
        "y": 14,
        "backup": false
      },
      {
        "name": "Ice Light",
        "need": 1,
        "x": 86,
        "y": 18,
        "backup": false
      },
      {
        "name": "Snow Lodge",
        "need": 4,
        "x": 14,
        "y": 48,
        "backup": false
      },
      {
        "name": "North Gate",
        "need": 3,
        "x": 50,
        "y": 46,
        "backup": true
      },
      {
        "name": "Stone Hut",
        "need": 2,
        "x": 86,
        "y": 48,
        "backup": false
      },
      {
        "name": "Glacier End",
        "need": 1,
        "x": 14,
        "y": 78,
        "backup": false
      },
      {
        "name": "Lake Ferry",
        "need": 2,
        "x": 50,
        "y": 78,
        "backup": false
      },
      {
        "name": "Polar Watch",
        "need": 1,
        "x": 86,
        "y": 78,
        "backup": false
      }
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        3,
        4
      ],
      [
        4,
        5
      ],
      [
        6,
        7
      ],
      [
        7,
        8
      ],
      [
        0,
        3
      ],
      [
        3,
        6
      ],
      [
        1,
        4
      ],
      [
        4,
        7
      ],
      [
        2,
        5
      ],
      [
        5,
        8
      ],
      [
        1,
        3
      ],
      [
        3,
        7
      ],
      [
        4,
        8
      ]
    ],
    "walkthrough": "Aurora HQ needs 2 more connections, with exactly 2 available. Each is required. Connect Aurora HQ–Frost Camp.\n\nAurora HQ needs 1 more connection, with exactly 1 available. Each is required. Connect Aurora HQ–Snow Lodge.\n\nFrost Camp ↔ Ice Light must stay inactive. The opposite choice forces North Gate behind a single vulnerable link. A backup route must survive any one link failing. Rule out Frost Camp–Ice Light.\n\nIce Light needs 1 more connection, with exactly 1 available. Each is required. Connect Ice Light–Stone Hut.\n\nSnow Lodge ↔ North Gate must connect. The opposite choice forces North Gate behind a single vulnerable link. A backup route must survive any one link failing. Connect Snow Lodge–North Gate.\n\nNorth Gate ↔ Stone Hut must connect. The opposite choice, followed through the station counts, cuts Ice Light off from HQ. Connect North Gate–Stone Hut.\n\nStone Hut already has all its connections. Its remaining links can be ruled out. Rule out Stone Hut–Polar Watch.\n\nGlacier End ↔ Lake Ferry must stay inactive. The opposite choice forces North Gate behind a single vulnerable link. A backup route must survive any one link failing. Rule out Glacier End–Lake Ferry.\n\nGlacier End needs 1 more connection, with exactly 1 available. Each is required. Connect Snow Lodge–Glacier End.\n\nLake Ferry ↔ Polar Watch must connect. The opposite choice forces North Gate to exceed its count. Connect Lake Ferry–Polar Watch.\n\nPolar Watch already has all its connections. Its remaining links can be ruled out. Rule out North Gate–Polar Watch.\n\nFrost Camp ↔ North Gate must connect. The opposite choice forces North Gate behind a single vulnerable link. A backup route must survive any one link failing. Connect Frost Camp–North Gate.\n\nFrost Camp already has all its connections. Its remaining links can be ruled out. Rule out Frost Camp–Snow Lodge.\n\nSnow Lodge needs 1 more connection, with exactly 1 available. Each is required. Connect Snow Lodge–Lake Ferry.",
    "reasoningSteps": 6
  },
  {
    "region": 5,
    "title": "All lights restored",
    "intro": "Stone Hut needs backup. Keep it connected if any single link fails.",
    "difficulty": "Expert",
    "nodes": [
      {
        "name": "Aurora HQ",
        "need": 2,
        "x": 14,
        "y": 17,
        "backup": false
      },
      {
        "name": "Frost Camp",
        "need": 3,
        "x": 50,
        "y": 14,
        "backup": false
      },
      {
        "name": "Ice Light",
        "need": 1,
        "x": 86,
        "y": 18,
        "backup": false
      },
      {
        "name": "Snow Lodge",
        "need": 2,
        "x": 14,
        "y": 48,
        "backup": false
      },
      {
        "name": "North Gate",
        "need": 4,
        "x": 50,
        "y": 46,
        "backup": false
      },
      {
        "name": "Stone Hut",
        "need": 2,
        "x": 86,
        "y": 48,
        "backup": true
      },
      {
        "name": "Glacier End",
        "need": 1,
        "x": 14,
        "y": 78,
        "backup": false
      },
      {
        "name": "Lake Ferry",
        "need": 2,
        "x": 50,
        "y": 78,
        "backup": false
      },
      {
        "name": "Polar Watch",
        "need": 1,
        "x": 86,
        "y": 78,
        "backup": false
      }
    ],
    "edges": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        3,
        4
      ],
      [
        4,
        5
      ],
      [
        6,
        7
      ],
      [
        7,
        8
      ],
      [
        0,
        3
      ],
      [
        3,
        6
      ],
      [
        1,
        4
      ],
      [
        4,
        7
      ],
      [
        2,
        5
      ],
      [
        5,
        8
      ],
      [
        1,
        5
      ],
      [
        4,
        6
      ]
    ],
    "walkthrough": "Aurora HQ needs 2 more connections, with exactly 2 available. Each is required. Connect Aurora HQ–Frost Camp.\n\nAurora HQ needs 1 more connection, with exactly 1 available. Each is required. Connect Aurora HQ–Snow Lodge.\n\nFrost Camp ↔ Ice Light must connect. The opposite choice forces Stone Hut behind a single vulnerable link. A backup route must survive any one link failing. Connect Frost Camp–Ice Light.\n\nIce Light already has all its connections. Its remaining links can be ruled out. Rule out Ice Light–Stone Hut.\n\nSnow Lodge ↔ North Gate must connect. The opposite choice forces Glacier End to exceed its count. Connect Snow Lodge–North Gate.\n\nSnow Lodge already has all its connections. Its remaining links can be ruled out. Rule out Snow Lodge–Glacier End.\n\nNorth Gate ↔ Stone Hut must connect. The opposite choice forces Stone Hut behind a single vulnerable link. A backup route must survive any one link failing. Connect North Gate–Stone Hut.\n\nGlacier End ↔ Lake Ferry must stay inactive. The opposite choice forces Stone Hut behind a single vulnerable link. A backup route must survive any one link failing. Rule out Glacier End–Lake Ferry.\n\nGlacier End needs 1 more connection, with exactly 1 available. Each is required. Connect North Gate–Glacier End.\n\nLake Ferry needs 2 more connections, with exactly 2 available. Each is required. Connect Lake Ferry–Polar Watch.\n\nLake Ferry needs 1 more connection, with exactly 1 available. Each is required. Connect North Gate–Lake Ferry.\n\nNorth Gate already has all its connections. Its remaining links can be ruled out. Rule out Frost Camp–North Gate.\n\nFrost Camp needs 1 more connection, with exactly 1 available. Each is required. Connect Frost Camp–Stone Hut.",
    "reasoningSteps": 4
  }
];
