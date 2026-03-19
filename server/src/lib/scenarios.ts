export const aScenarios = [
  {
    id: "1",
    name: "Providing information on a passage through a strait",
    starter: "vessel",
    turns: [
      {
        vessel_instruction: "You are MV Sunrise. Call Europe VTS.",
        vessel_message: "Europe VTS, Europe VTS. This is MV Sunrise. Over.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
        vts_instruction: "You are Europe VTS. Answer MV Sunrise.",
      },
      {
        vessel_instruction:
          "Due to strong winds in Sandybay Strait, ask to increase speed from 10 knots.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. QUESTION. Do we have permission to increase speed from one zero knots due to strong winds in Sandybay Strait? Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. QUESTION. What is the current wind speed and direction? Over.",
        vts_instruction:
          "Ask about current wind speed and direction. Use a message marker.",
      },
      {
        vessel_instruction: "Wind speed: 35 knots. Direction: North East.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. ANSWER. Wind speed is three five knots and north east direction. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. QUESTION. Are there any fishing vessels in your vicinity? Over.",
        vts_instruction:
          "Ask if there are any fishing vessels nearby. Use a message marker.",
      },
      {
        vessel_instruction: "There are no fishing vessels nearby.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. ANSWER. No fishing vessels in the vicinity. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. INFORMATION. You have permission to increase speed. Out.",
        vts_instruction:
          "Grant permission to increase speed and close the call using 'Out'.",
      },
    ],
  },
  {
    id: "2",
    name: "Providing and reading back anchoring position coordinates",
    starter: "vessel",
    turns: [
      {
        vessel_instruction: "You are MV Sunrise. Call Europe VTS.",
        vessel_message: "Europe VTS, Europe VTS. This is MV Sunrise. Over.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
        vts_instruction: "You are Europe VTS. Answer MV Sunrise.",
      },
      {
        vessel_instruction: "Acknowledge the call.",
        vessel_message: "Europe VTS, this is MV Sunrise. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. ADVICE. Anchor at Bravo three. Over.",
        vts_instruction:
          "Advise Sunrise to anchor in position B3. Use a message marker.",
      },
      {
        vessel_instruction: "Ask for the coordinates of position Bravo 3.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. QUESTION. What is the position of Bravo three? Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. The position is four five degrees three four decimal three zero minutes north, zero one three degrees four one decimal seven five minutes east. Read back. Over.",
        vts_instruction:
          "Answer with coordinates (45 34.30 N, 013 41.75 E). Use decimal and separate digits. Ask for read back.",
      },
      {
        vessel_instruction: "Read back the coordinates provided.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. Bravo three is position four five degrees three four decimal three zero minutes north, zero one three degrees four one decimal seven five minutes east. Over.",
        vts_message: "MV Sunrise, this is Europe VTS. Correct. Out.",
        vts_instruction: "Confirm the read back is correct and close the call.",
      },
    ],
  },
  {
    id: "3",
    name: "Vessel enters VTS area and must drop anchor to wait for pilot",
    starter: "vessel",
    turns: [
      {
        vessel_instruction: "You are MV Sunrise. Call Europe VTS.",
        vessel_message:
          "Europe VTS, Europe VTS. This is MV Sunrise. We are entering the area. Request pilot. Over.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
        vts_instruction: "You are Europe VTS. Answer MV Sunrise.",
      },
      {
        vessel_instruction: "Acknowledge and wait for questions.",
        vessel_message: "Europe VTS, this is MV Sunrise. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. QUESTION. What is your call sign, flag, draft and destination berth? Over.",
        vts_instruction:
          "Ask for ship particulars: call sign, flag, draft, and destination berth.",
      },
      {
        vessel_instruction:
          "Provide particulars: V7RU3, Greek, 8.5m, Atlantis pier 3.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. Call sign Victor seven Romeo Uniform three. Greek flag. Draft eight decimal five metres. Destination Atlantis pier three. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. ADVICE. Proceed to anchorage area Alpha and wait for pilot. Over.",
        vts_instruction:
          "Advise Sunrise to proceed to anchorage area Alpha and wait for pilot there.",
      },
      {
        vessel_instruction: "Acknowledge the advice.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. RECEIVED. We will proceed to anchorage Alpha and wait for pilot. Over.",
        vts_message: "MV Sunrise, this is Europe VTS. Out.",
        vts_instruction: "Close the call.",
      },
    ],
  },
  {
    id: "4",
    name: "Vessel ready to departure calls to ask clearance",
    starter: "vessel",
    turns: [
      {
        vessel_instruction: "You are MV Sunrise. Call Europe VTS.",
        vessel_message:
          "Europe VTS, Europe VTS. This is MV Sunrise. INFORMATION. We are ready to depart. Request clearance. Over.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
        vts_instruction: "You are Europe VTS. Answer MV Sunrise.",
      },
      {
        vessel_instruction: "Acknowledge and wait for instructions.",
        vessel_message: "Europe VTS, this is MV Sunrise. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. You have permission to depart. Stand by on VHF channels one six and one four. Over.",
        vts_instruction:
          "Grant permission to depart. Advise to maintain VHF watch on channels 16 and 14.",
      },
      {
        vessel_instruction: "Confirm permission and watch channels.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. RECEIVED. Permission to depart. Standing by on channels one six and one four. Over.",
        vts_message: "MV Sunrise, this is Europe VTS. Out.",
        vts_instruction: "Close the call.",
      },
    ],
  },
  {
    id: "5",
    name: "Entering the reporting zone",
    starter: "vessel",
    turns: [
      {
        vessel_instruction: "You are MV Sunrise. Call Europe VTS.",
        vessel_message:
          "Europe VTS, Europe VTS. This is MV Sunrise. INFORMATION. We are entering your reporting zone. Over.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
        vts_instruction: "You are Europe VTS. Answer MV Sunrise.",
      },
      {
        vessel_instruction: "Provide position: 45 30 N, 013 35 E.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. My position is four five degrees three zero minutes North, zero one three degrees three five minutes East. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. RECEIVED. QUESTION. What is your position? Over.",
        vts_instruction: "Acknowledge and ask for their position.",
      },
      {
        vessel_instruction: "Provide course 270 and speed 12 knots.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. Course is two seven zero degrees, speed one two knots. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. QUESTION. What is your course and speed? Over.",
        vts_instruction: "Ask for their course and speed.",
      },
      {
        vessel_instruction: "Acknowledge the final contact.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. RECEIVED. Course two seven zero, speed one two knots. Out.",
        vts_message: "MV Sunrise, this is Europe VTS. RECEIVED. Out.",
        vts_instruction: "Acknowledge and close the call.",
      },
    ],
  },
  {
    id: "6",
    name: "Vessel in transit to pilot station",
    starter: "vessel",
    turns: [
      {
        vessel_instruction: "You are MV Sunrise. Call Europe VTS.",
        vessel_message:
          "Europe VTS, Europe VTS. This is MV Sunrise. We are entering from the west in transit to pilot station. Boarding time one three zero zero. Over.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
        vts_instruction: "You are Europe VTS. Answer MV Sunrise.",
      },
      {
        vessel_instruction: "Acknowledge update.",
        vessel_message: "Europe VTS, this is MV Sunrise. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. RECEIVED. You are entering VTS area, in transit, to pilot station. No traffic information for you. Over.",
        vts_instruction:
          "Read back the received information. Tell Sunrise there is no traffic information.",
      },
      {
        vessel_instruction: "Ask if pilot will board from shoreside.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. QUESTION. Will pilot board from shoreside? Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. Pilot will board from shoreside. Call pilot station on channel one three, one hour prior to ETA. Over.",
        vts_instruction:
          "Confirm pilot boards from shoreside. Tell them to call pilot station on Ch 13 one hour prior to ETA.",
      },
      {
        vessel_instruction: "Acknowledge arrangements.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. RECEIVED. We will call pilot station one hour prior to ETA. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. Stand by on VHF channels one four and one six. Out.",
        vts_instruction:
          "Inform Sunrise which channels to stand by on: 14, 16. Close the call.",
      },
    ],
  },
  {
    id: "7",
    name: "Traffic information on permission to drift",
    starter: "vessel",
    turns: [
      {
        vessel_instruction: "You are MV Sunrise. Call Europe VTS.",
        vessel_message:
          "Europe VTS, Europe VTS. This is MV Sunrise. Request permission to drift in position. Over.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
        vts_instruction: "You are Europe VTS. Answer MV Sunrise.",
      },
      {
        vessel_instruction: "State reason: engine trouble.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. We have engine trouble. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. QUESTION. What is the reason for drifting? Over.",
        vts_instruction: "Ask for the reason for drifting.",
      },
      {
        vessel_instruction: "Acknowledge the update requirement.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. RECEIVED. We will call back in one hour. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. Permission granted to drift. REQUEST. Call back in one hour. Out.",
        vts_instruction:
          "Grant permission to drift. Request update in one hour.",
      },
    ],
  },
  {
    id: "8",
    name: "Tugboat outbound to escort incoming vessel to berth",
    starter: "vessel",
    turns: [
      {
        vessel_instruction: "You are tug Sunrise. Call Europe VTS.",
        vessel_message:
          "Europe VTS, Europe VTS. This is tug Sunrise. INFORMATION. We are outbound to escort MV Atlantic to berth five. Over.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
        vts_instruction: "You are Europe VTS. Answer the tug.",
      },
      {
        vessel_instruction: "Provide ETA to meeting point: 14.30 local.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. ETA to meeting point is one four three zero local time. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. RECEIVED. QUESTION. What is your ETA to the meeting point? Over.",
        vts_instruction: "Acknowledge and ask for ETA to meeting point.",
      },
      {
        vessel_instruction: "Acknowledge traffic information.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. RECEIVED. We will look out for MV Pacific. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. RECEIVED. Traffic information. MV Pacific is outbound. Out.",
        vts_instruction:
          "Acknowledge and provide traffic information: MV Pacific is outbound.",
      },
    ],
  },
  {
    id: "9",
    name: "Vessel entering VTS area, in transit",
    starter: "vessel",
    turns: [
      {
        vessel_instruction: "You are MV Sunrise. Call Europe VTS.",
        vessel_message:
          "Europe VTS, Europe VTS. This is MV Sunrise. INFORMATION. We are entering VTS area in transit to Hamburg. Over.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
        vts_instruction: "You are Europe VTS. Answer MV Sunrise.",
      },
      {
        vessel_instruction: "Provide ETA: 18.00 local.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. ETA to exit point is one eight zero zero local time. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. RECEIVED. QUESTION. What is your ETA to exit point? Over.",
        vts_instruction: "Acknowledge. Ask for ETA to exit point.",
      },
      {
        vessel_instruction: "Acknowledge and close call.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. RECEIVED. Stand by on channel one six. Out.",
        vts_message:
          "MV Sunrise, this is Europe VTS. RECEIVED. Stand by on channel one six. Out.",
        vts_instruction:
          "Inform vessel to maintain watch on channel 16. Close the call.",
      },
    ],
  },
  {
    id: "10",
    name: "Leaving the TSS",
    starter: "vessel",
    turns: [
      {
        vessel_instruction: "You are MV Sunrise. Call Europe VTS.",
        vessel_message:
          "Europe VTS, Europe VTS. This is MV Sunrise. INFORMATION. We are leaving the traffic separation scheme. Over.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
        vts_instruction: "You are Europe VTS. Answer MV Sunrise.",
      },
      {
        vessel_instruction: "Acknowledge and end communication.",
        vessel_message: "Europe VTS, this is MV Sunrise. Out.",
        vts_message:
          "MV Sunrise, this is Europe VTS. RECEIVED. Have a safe voyage. Out.",
        vts_instruction: "Acknowledge and wish them a safe voyage.",
      },
    ],
  },
  {
    id: "11",
    name: "Vessel underway with pilot onboard",
    starter: "vessel",
    turns: [
      {
        vessel_instruction: "You are MV Sunrise. Call Europe VTS.",
        vessel_message:
          "Europe VTS, Europe VTS. This is MV Sunrise. Anchor is up from X1, underway to Pilot Station one. Over.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
        vts_instruction: "You are Europe VTS. Answer MV Sunrise.",
      },
      {
        vessel_instruction: "Acknowledge the order to wait. Ask for wait time.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. RECEIVED. We are underway but keeping position. QUESTION. How long will we wait? Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. Your anchor is aweigh. INFORMATION. Wait in position, do not get underway. I repeat. Wait in position for instructions. Over.",
        vts_instruction:
          "Confirm info. Tell Sunrise not to get underway. Order to wait in position. Repeat message.",
      },
      {
        vessel_instruction: "Acknowledge pilot boarding time.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. RECEIVED. Pilot boarding time one one zero zero. Is that correct? Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. The pilot boarding time is one one zero zero local time. You will soon receive more information. Over.",
        vts_instruction:
          "Answer that pilot boarding is at 11.00 local. Mention more info coming. Separate digits.",
      },
      {
        vessel_instruction: "Confirm and close call.",
        vessel_message: "Europe VTS, this is MV Sunrise. Out.",
        vts_message:
          "MV Sunrise, this is Europe VTS. Yes, that is correct. Out.",
        vts_instruction: "Answer in the affirmative and end call.",
      },
    ],
  },
  {
    id: "12",
    name: "Vessel entering VTS area bound for berth place",
    starter: "vessel",
    turns: [
      {
        vessel_instruction: "You are MV Sunrise. Call Europe VTS.",
        vessel_message:
          "Europe VTS, Europe VTS. This is MV Sunrise. Bound for Atlantis berth three. Request info on berthing. Over.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
        vts_instruction: "You are Europe VTS. Answer MV Sunrise.",
      },
      {
        vessel_instruction: "Acknowledge pilot and tug info.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. RECEIVED. Pilot boarding at one zero zero zero. Tug assistance available. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. INFORMATION. Pilot will board at pilot station at one zero zero zero. Tug assistance is available. Over.",
        vts_instruction:
          "Provide info: pilot boards at 10.00. Tug assistance available.",
      },
      {
        vessel_instruction: "Close communication.",
        vessel_message: "Europe VTS, this is MV Sunrise. Out.",
        vts_message: "MV Sunrise, this is Europe VTS. Correct. Out.",
        vts_instruction: "Close the call.",
      },
    ],
  },
  {
    id: "13",
    name: "Mandatory ship reporting",
    starter: "vessel",
    turns: [
      {
        vessel_instruction: "You are MV Sunrise. Call Europe VTS.",
        vessel_message:
          "Europe VTS, Europe VTS. This is MV Sunrise. Mandatory report. Position 45 30 N, 013 40 E. Course 180, speed 14. Dest Rotterdam. ETA 06.00. Over.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
        vts_instruction: "You are Europe VTS. Answer MV Sunrise.",
      },
      {
        vessel_instruction: "Confirm accuracy.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. That is correct. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. RECEIVED. Mandatory report received. Position four five degrees three zero minutes North, zero one three degrees four zero minutes East. Course one eight zero, speed one four knots. Destination Rotterdam. ETA zero six zero zero tomorrow. Over.",
        vts_instruction:
          "Acknowledge the report and confirm the information by reading it back.",
      },
      {
        vessel_instruction: "Close call.",
        vessel_message: "Europe VTS, this is MV Sunrise. Out.",
        vts_message: "MV Sunrise, this is Europe VTS. Out.",
        vts_instruction: "Close the call.",
      },
    ],
  },
  {
    id: "14",
    name: "Tug operations with barge in tow",
    starter: "vessel",
    turns: [
      {
        vessel_instruction: "You are tug Sunrise. Call Europe VTS.",
        vessel_message:
          "Europe VTS, Europe VTS. This is tug Sunrise with barge in tow. Entering VTS area. Length of tow two hundred metres. Over.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
        vts_instruction: "You are Europe VTS. Answer the tug.",
      },
      {
        vessel_instruction: "Provide destination: Atlantis port, berth 7.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. Destination is Atlantis port, berth seven. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. RECEIVED. Length of tow two hundred metres. QUESTION. What is your destination? Over.",
        vts_instruction: "Acknowledge and ask for destination.",
      },
      {
        vessel_instruction: "Acknowledge no traffic.",
        vessel_message: "Europe VTS, this is MV Sunrise. RECEIVED. Out.",
        vts_message:
          "MV Sunrise, this is Europe VTS. RECEIVED. No traffic information for you. Out.",
        vts_instruction:
          "Provide traffic information (none) and close the call.",
      },
    ],
  },
  {
    id: "15",
    name: "VTS grants the ship permission to enter the bay",
    starter: "vessel",
    turns: [
      {
        vessel_instruction: "You are MV Sunrise. Call Europe VTS.",
        vessel_message:
          "Europe VTS, Europe VTS. This is MV Sunrise. Request permission to enter the bay. Over.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
        vts_instruction: "You are Europe VTS. Answer MV Sunrise.",
      },
      {
        vessel_instruction: "Acknowledge permission.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. RECEIVED. Permission to enter the bay. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. You have permission to enter the bay. Over.",
        vts_instruction: "Grant permission to enter the bay.",
      },
      {
        vessel_instruction: "Close call.",
        vessel_message: "Europe VTS, this is MV Sunrise. Out.",
        vts_message: "MV Sunrise, this is Europe VTS. Out.",
        vts_instruction: "Close the call.",
      },
    ],
  },
  {
    id: "16",
    name: "Traffic and anchoring information",
    starter: "vessel",
    turns: [
      {
        vessel_instruction: "You are MV Sunrise. Call Europe VTS.",
        vessel_message:
          "Europe VTS, Europe VTS. This is MV Sunrise. Request anchoring info and traffic update. Over.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
        vts_instruction: "You are Europe VTS. Answer MV Sunrise.",
      },
      {
        vessel_instruction: "Acknowledge Alpha 1 and outbound traffic.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. RECEIVED. Alpha one and one vessel outbound. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. INFORMATION. Anchoring area is Alpha one. Traffic information. One vessel outbound. Over.",
        vts_instruction:
          "Provide anchoring area Alpha 1 and traffic: one vessel outbound.",
      },
      {
        vessel_instruction: "Close call.",
        vessel_message: "Europe VTS, this is MV Sunrise. Out.",
        vts_message: "MV Sunrise, this is Europe VTS. Out.",
        vts_instruction: "Close the call.",
      },
    ],
  },
  {
    id: "17",
    name: "Is the vessel AIS operational?",
    starter: "vts",
    turns: [
      {
        vessel_instruction: "You are MV Sunrise. Answer VTS.",
        vessel_message: "Europe VTS, this is MV Sunrise. Over.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
        vts_instruction:
          "You are Europe VTS. Call Sunrise to verify AIS status.",
      },
      {
        vessel_instruction: "Confirm AIS is operational.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. ANSWER. Yes, AIS is operational. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. QUESTION. Is your AIS operational? Over.",
        vts_instruction: "Ask if their AIS is operational.",
      },
      {
        vessel_instruction: "Close call.",
        vessel_message: "Europe VTS, this is MV Sunrise. Out.",
        vts_message: "MV Sunrise, this is Europe VTS. RECEIVED. Out.",
        vts_instruction: "Close the call.",
      },
    ],
  },
  {
    id: "18",
    name: "VTS requires ETA, cargo quantity and crew count",
    starter: "vts",
    turns: [
      {
        vessel_instruction: "You are MV Sunrise. Answer VTS.",
        vessel_message: "Europe VTS, this is MV Sunrise. Over.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
        vts_instruction:
          "You are Europe VTS. Call Sunrise to request information.",
      },
      {
        vessel_instruction: "Provide: ETA 14.00, 5000t cargo, 20 crew.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. ANSWER. ETA one four zero zero. Cargo five thousand tons. Crew two zero persons. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. QUESTION. What is your ETA, cargo quantity, and number of crew? Over.",
        vts_instruction: "Ask for ETA, cargo quantity, and number of crew.",
      },
      {
        vessel_instruction: "Close call.",
        vessel_message: "Europe VTS, this is MV Sunrise. Out.",
        vts_message:
          "MV Sunrise, this is Europe VTS. RECEIVED. ETA one four zero zero. Cargo five thousand tons. Crew two zero persons. Out.",
        vts_instruction: "Acknowledge and close the call.",
      },
    ],
  },
  {
    id: "19",
    name: "Asking for ship particulars and ETA",
    starter: "vts",
    turns: [
      {
        vessel_instruction: "You are MV Sunrise. Answer VTS.",
        vessel_message: "Europe VTS, this is MV Sunrise. Over.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
        vts_instruction: "You are Europe VTS. Call MV Sunrise.",
      },
      {
        vessel_instruction: "Provide name, V7RU3, Malta, 16.00.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. Ship name Sunrise, call sign Victor seven Romeo Uniform three, Malta flag, ETA one six zero zero. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. QUESTION. What is your name, call sign, flag, and ETA? Over.",
        vts_instruction:
          "Ask for ship particulars: name, call sign, flag, and ETA.",
      },
      {
        vessel_instruction: "Close call.",
        vessel_message: "Europe VTS, this is MV Sunrise. Out.",
        vts_message: "MV Sunrise, this is Europe VTS. RECEIVED. Out.",
        vts_instruction: "Acknowledge and close the call.",
      },
    ],
  },
  {
    id: "20",
    name: "Informing VTS about dangerous cargo",
    starter: "vessel",
    turns: [
      {
        vessel_instruction: "You are MV Sunrise. Call Europe VTS.",
        vessel_message:
          "Europe VTS, Europe VTS. This is MV Sunrise. INFORMATION. Carrying dangerous cargo, Class three, quantity five hundred tons. Over.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
        vts_instruction: "You are Europe VTS. Answer MV Sunrise.",
      },
      {
        vessel_instruction: "Confirm info.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. That is correct. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. RECEIVED. Dangerous cargo Class three, quantity five hundred tons. Over.",
        vts_instruction: "Acknowledge the dangerous cargo information.",
      },
      {
        vessel_instruction: "Close call.",
        vessel_message: "Europe VTS, this is MV Sunrise. Out.",
        vts_message: "MV Sunrise, this is Europe VTS. Out.",
        vts_instruction: "Close the call.",
      },
    ],
  },
  {
    id: "21",
    name: "Approaching port",
    starter: "vessel",
    turns: [
      {
        vessel_instruction: "You are MV Sunrise. Call VTS.",
        vessel_message:
          "Europe VTS, Europe VTS. This is MV Sunrise. I am about to pass reporting point. Over.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
        vts_instruction: "You are Europe VTS. Answer Sunrise entering sector.",
      },
      {
        vessel_instruction: "State cargo: MTBE.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. ANSWER. My cargo on board is MTBE. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. QUESTION. What is your cargo on board? Over.",
        vts_instruction:
          "Ask Sunrise about the type of cargo on board. Use marker.",
      },
      {
        vessel_instruction: "State quantity: 4990.052t, Class 3.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. ANSWER. Quantity is four nine nine zero decimal zero five two metric tons. Class three cargo. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. RECEIVED. Your cargo is MTBE. QUESTION. What is the quantity of cargo on board? Over.",
        vts_instruction:
          "Acknowledge cargo type. Ask for quantity. Use marker.",
      },
      {
        vessel_instruction: "State arrival draft: 7.05m.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. ANSWER. Draft on arrival is seven decimal zero five metres. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. RECEIVED. Four nine nine zero decimal zero five two tons. QUESTION. What is your draft on arrival? Over.",
        vts_instruction:
          "Acknowledge quantity (separate digits). Ask for arrival draft.",
      },
      {
        vessel_instruction: "State bunkers: DO 90.81, LO 8005, FO 135.16.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. ANSWER. Diesel oil quantity nine zero decimal eight one, lube oil quantity eight zero zero five litres, and fuel oil quantity one three five decimal one six tons. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. QUESTION. What is the quantity of bunkers on arrival? Fuel oil, diesel oil, lube oil on board? Over.",
        vts_instruction: "Ask for bunker quantities on arrival.",
      },
      {
        vessel_instruction: "State POB: 14.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. ANSWER. Total number of persons on board is one four, including Master. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. RECEIVED. QUESTION. What is the number of persons on board? Over.",
        vts_instruction: "Acknowledge and ask for total POB.",
      },
      {
        vessel_instruction: "State ETA Sandybay: 05.00.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. ANSWER. ETA to Sandybay Pilot is zero five zero zero hours. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. QUESTION. What is your ETA to Sandybay? Over.",
        vts_instruction: "Ask for ETA to Sandybay. Use marker.",
      },
      {
        vessel_instruction: "Acknowledge Sandybay Traffic contact info.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. RECEIVED. Contact Sandybay Traffic zero nine, stand by one four and one six. Out.",
        vts_message:
          "MV Sunrise, this is Europe VTS. ADVICE. Contact Sandybay Traffic one and a half hours before arrival for berthing, on channel zero nine. Stand by one four, one six. Out.",
        vts_instruction:
          "Advise contact 1.5hrs prior arrival on Ch 09. Stand by 14/16. Separate digits. Out.",
      },
    ],
  },
  {
    id: "22",
    name: "Vessel at anchor, preparing to get underway",
    starter: "vessel",
    turns: [
      {
        vessel_instruction: "You are MV Sunrise. Call Europe VTS.",
        vessel_message:
          "Europe VTS, Europe VTS. This is MV Sunrise. At anchor, preparing to get underway. Request permission. Over.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
        vts_instruction: "You are Europe VTS. Answer MV Sunrise.",
      },
      {
        vessel_instruction: "Acknowledge permission.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. RECEIVED. Permission to get underway. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. You have permission to get underway. Over.",
        vts_instruction: "Grant permission to get underway.",
      },
      {
        vessel_instruction: "Close call.",
        vessel_message: "Europe VTS, this is MV Sunrise. Out.",
        vts_message: "MV Sunrise, this is Europe VTS. Out.",
        vts_instruction: "Close the call.",
      },
    ],
  },
  {
    id: "23",
    name: "Entering VTS area, proceeding to anchor for bunkering",
    starter: "vessel",
    turns: [
      {
        vessel_instruction: "You are MV Sunrise. Call Europe VTS.",
        vessel_message:
          "Europe VTS, Europe VTS. This is MV Sunrise. Entering area, proceeding to anchorage for bunkering. Over.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
        vts_instruction: "You are Europe VTS. Answer MV Sunrise.",
      },
      {
        vessel_instruction: "Acknowledge Bravo 2 assignment.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. RECEIVED. Proceeding to anchorage Bravo two. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. RECEIVED. Proceed to anchorage area Bravo two for bunkering. Over.",
        vts_instruction: "Acknowledge and assign anchorage area Bravo 2.",
      },
      {
        vessel_instruction: "Close call.",
        vessel_message: "Europe VTS, this is MV Sunrise. Out.",
        vts_message: "MV Sunrise, this is Europe VTS. Out.",
        vts_instruction: "Close the call.",
      },
    ],
  },
  {
    id: "24",
    name: "Sending the passage plan",
    starter: "vessel",
    turns: [
      {
        vessel_instruction: "You are MV Sunrise. Call Europe VTS.",
        vessel_message:
          "Europe VTS, Europe VTS. This is MV Sunrise. INFORMATION. I have sent the passage plan via email. Over.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
        vts_instruction: "You are Europe VTS. Answer MV Sunrise.",
      },
      {
        vessel_instruction: "Acknowledge receipt.",
        vessel_message: "Europe VTS, this is MV Sunrise. RECEIVED. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. RECEIVED. Your passage plan has been received. Over.",
        vts_instruction: "Acknowledge receipt of the passage plan.",
      },
      {
        vessel_instruction: "Close call.",
        vessel_message: "Europe VTS, this is MV Sunrise. Out.",
        vts_message: "MV Sunrise, this is Europe VTS. Out.",
        vts_instruction: "Close the call.",
      },
    ],
  },
  {
    id: "25",
    name: "Permission to start bunkering operations",
    starter: "vessel",
    turns: [
      {
        vessel_instruction: "You are MV Sunrise. Call Europe VTS.",
        vessel_message:
          "Europe VTS, Europe VTS. This is MV Sunrise. Request permission to start bunkering operations. Over.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
        vts_instruction: "You are Europe VTS. Answer MV Sunrise.",
      },
      {
        vessel_instruction: "Acknowledge permission.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. RECEIVED. Permission to start bunkering. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. You have permission to start bunkering operations. Over.",
        vts_instruction: "Grant permission to start bunkering.",
      },
      {
        vessel_instruction: "Close call.",
        vessel_message: "Europe VTS, this is MV Sunrise. Out.",
        vts_message: "MV Sunrise, this is Europe VTS. Out.",
        vts_instruction: "Close the call.",
      },
    ],
  },
  {
    id: "26",
    name: "Carriage of dangerous goods",
    starter: "vts",
    turns: [
      {
        vessel_instruction: "You are MV Sunrise. Answer VTS.",
        vessel_message: "Europe VTS, this is MV Sunrise. Over.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
        vts_instruction:
          "You are Europe VTS. Call Sunrise to inquire about dangerous goods.",
      },
      {
        vessel_instruction: "State: Class 2, 100 tons.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. ANSWER. Yes, we are carrying Class two dangerous goods, quantity one hundred tons. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. QUESTION. Are you carrying any dangerous goods? Over.",
        vts_instruction: "Ask if they are carrying any dangerous goods.",
      },
      {
        vessel_instruction: "Close call.",
        vessel_message: "Europe VTS, this is MV Sunrise. Out.",
        vts_message:
          "MV Sunrise, this is Europe VTS. RECEIVED. Class two dangerous goods, one hundred tons. Out.",
        vts_instruction: "Acknowledge and close the call.",
      },
    ],
  },
  {
    id: "27",
    name: "Arrival of pilot and preparations for berthing",
    starter: "vessel",
    turns: [
      {
        vessel_instruction: "You are MV Sunrise. Call Europe VTS.",
        vessel_message:
          "Europe VTS, Europe VTS. This is MV Sunrise. INFORMATION. Pilot on board. Preparations complete. Over.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
        vts_instruction: "You are Europe VTS. Answer MV Sunrise.",
      },
      {
        vessel_instruction: "Acknowledge permission.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. RECEIVED. Proceeding to berth. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. RECEIVED. You have permission to proceed to berth. Over.",
        vts_instruction:
          "Acknowledge and grant permission to proceed to berth.",
      },
      {
        vessel_instruction: "Close call.",
        vessel_message: "Europe VTS, this is MV Sunrise. Out.",
        vts_message: "MV Sunrise, this is Europe VTS. Out.",
        vts_instruction: "Close the call.",
      },
    ],
  },
  {
    id: "28",
    name: "Pilot transfer arrangements",
    starter: "vessel",
    turns: [
      {
        vessel_instruction: "You are MV Sunrise. Call Europe VTS.",
        vessel_message:
          "Europe VTS, Europe VTS. This is MV Sunrise. QUESTION. What are the pilot transfer arrangements? Over.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
        vts_instruction: "You are Europe VTS. Answer MV Sunrise.",
      },
      {
        vessel_instruction: "Acknowledge arrangements.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. RECEIVED. Pilot ladder starboard, two metres above water. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. INFORMATION. Pilot ladder on starboard side, two metres above water. Over.",
        vts_instruction: "Provide info: ladder on starboard, 2m above water.",
      },
      {
        vessel_instruction: "Close call.",
        vessel_message: "Europe VTS, this is MV Sunrise. Out.",
        vts_message: "MV Sunrise, this is Europe VTS. Correct. Out.",
        vts_instruction: "Close the call.",
      },
    ],
  },
  {
    id: "29",
    name: "VTS conveys pilot boarding information",
    starter: "vts",
    turns: [
      {
        vessel_instruction: "You are MV Sunrise. Answer VTS.",
        vessel_message: "Europe VTS, this is MV Sunrise. Over.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
        vts_instruction:
          "You are Europe VTS. Call Sunrise to provide boarding info.",
      },
      {
        vessel_instruction: "Acknowledge: 09.30, Alpha.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. RECEIVED. Pilot boarding at zero nine three zero at station Alpha. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. INFORMATION. Pilot boarding time zero nine three zero at pilot station Alpha. Over.",
        vts_instruction: "Provide boarding info: 09.30 at pilot station Alpha.",
      },
      {
        vessel_instruction: "Close call.",
        vessel_message: "Europe VTS, this is MV Sunrise. Out.",
        vts_message: "MV Sunrise, this is Europe VTS. Correct. Out.",
        vts_instruction: "Close the call.",
      },
    ],
  },
  {
    id: "30",
    name: "Tugboat report",
    starter: "vessel",
    turns: [
      {
        vessel_instruction: "You are tug Sunrise. Call Europe VTS.",
        vessel_message:
          "Europe VTS, Europe VTS. This is tug Sunrise. REPORT. Towing operation completed successfully. Over.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
        vts_instruction: "You are Europe VTS. Answer the tug.",
      },
      {
        vessel_instruction: "Acknowledge end of call.",
        vessel_message: "Europe VTS, this is MV Sunrise. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. RECEIVED. Received your report. Towing operation completed. Over.",
        vts_instruction: "Acknowledge the report.",
      },
      {
        vessel_instruction: "Close call.",
        vessel_message: "Europe VTS, this is MV Sunrise. Out.",
        vts_message: "MV Sunrise, this is Europe VTS. Out.",
        vts_instruction: "Close the call.",
      },
    ],
  },
];

export const bScenarios = [
  {
    id: "31",
    name: "Checking a reported spillage",
    starter: "vts",
    turns: [
      {
        vessel_instruction: "You are MV Sunrise. Answer Europe VTS.",
        vessel_message: "Europe VTS, this is MV Sunrise. Over.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
        vts_instruction: "You are Europe VTS. Call MV Sunrise.",
      },
      {
        vessel_instruction: "Ask if spillage is at the bow section.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. QUESTION. Is the reported spillage at the bow section? Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. REQUEST. Check reported spillage alongside your vessel. Over.",
        vts_instruction:
          "Ask Sunrise to check a reported spillage alongside their vessel. Use marker.",
      },
      {
        vessel_instruction: "Confirm you will check and report.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. RECEIVED. I will check the spillage and report. Stand by. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. ANSWER. Yes, the reported spillage is at the bow section. Over.",
        vts_instruction: "Answer the question in the affirmative.",
      },
      {
        vessel_instruction: "Close communication.",
        vessel_message: "Europe VTS, this is MV Sunrise. Out.",
        vts_message: "MV Sunrise, this is Europe VTS. I will stand by. Out.",
        vts_instruction: "Confirm standing by and end call.",
      },
    ],
  },
  {
    id: "32",
    name: "Vessel must reduce excessive speed",
    starter: "vts",
    turns: [
      {
        vessel_instruction: "You are MV Sunrise. Answer Europe VTS.",
        vessel_message: "Europe VTS, this is MV Sunrise. Over.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
        vts_instruction: "You are Europe VTS. Call MV Sunrise.",
      },
      {
        vessel_instruction: "Acknowledge speed reduction to 10 knots.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. RECEIVED. Reducing speed to one zero knots. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. INFORMATION. Your speed is excessive. REQUEST. Reduce speed to one zero knots. Over.",
        vts_instruction:
          "Inform Sunrise speed is excessive. Request reduction to 10 knots.",
      },
      {
        vessel_instruction: "Close call.",
        vessel_message: "Europe VTS, this is MV Sunrise. Out.",
        vts_message: "MV Sunrise, this is Europe VTS. RECEIVED. Out.",
        vts_instruction: "Acknowledge and close the call.",
      },
    ],
  },
  {
    id: "33",
    name: "Vessel navigating in a narrow waterway",
    starter: "vts",
    turns: [
      {
        vessel_instruction: "You are MV Sunrise. Answer Europe VTS.",
        vessel_message: "Europe VTS, this is MV Sunrise. Over.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
        vts_instruction: "You are Europe VTS. Call Sunrise in narrow waterway.",
      },
      {
        vessel_instruction: "Acknowledge keeping to starboard.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. RECEIVED. Keeping to starboard. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. WARNING. Keep to starboard side of the channel. Over.",
        vts_instruction: "Warn them to keep to starboard side of the channel.",
      },
      {
        vessel_instruction: "Close call.",
        vessel_message: "Europe VTS, this is MV Sunrise. Out.",
        vts_message: "MV Sunrise, this is Europe VTS. Out.",
        vts_instruction: "Close the call.",
      },
    ],
  },
  {
    id: "34",
    name: "Vessel adrift due to unstable weather forecast",
    starter: "vts",
    turns: [
      {
        vessel_instruction: "You are MV Sunrise. Answer Europe VTS.",
        vessel_message: "Europe VTS, this is MV Sunrise. Over.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
        vts_instruction: "You are Europe VTS. Call MV Sunrise which is adrift.",
      },
      {
        vessel_instruction: "State reason: waiting for weather.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. ANSWER. Waiting for weather to improve. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. QUESTION. What is the reason for drifting? Over.",
        vts_instruction: "Ask about the reason for drifting.",
      },
      {
        vessel_instruction: "Acknowledge and plan to proceed in 2 hours.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. RECEIVED. We will proceed in two hours. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. INFORMATION. Weather improving. You may proceed in two hours. Over.",
        vts_instruction:
          "Provide weather update and advise they can proceed in 2 hours.",
      },
      {
        vessel_instruction: "Close call.",
        vessel_message: "Europe VTS, this is MV Sunrise. Out.",
        vts_message: "MV Sunrise, this is Europe VTS. Out.",
        vts_instruction: "Close the call.",
      },
    ],
  },
  {
    id: "35",
    name: "Strange object in the fairway",
    starter: "vts",
    turns: [
      {
        vessel_instruction: "You are MV Sunrise. Answer Europe VTS.",
        vessel_message: "Europe VTS, this is MV Sunrise. Over.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
        vts_instruction: "Establish contact with MV Sunrise.",
      },
      {
        vessel_instruction: "State cannot see due to lights.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. ANSWER. We cannot see with lights. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. INFORMATION. Unknown object reported in the fairway at distance two decimal three miles. QUESTION. What type of object is this? Over.",
        vts_instruction:
          "Inform about object at 2.3 miles. Ask for type. Use two markers. Separate digits.",
      },
      {
        vessel_instruction: "State object appears floating.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. ANSWER. The object appears to be floating. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. QUESTION. Is the object floating or submerged? Over.",
        vts_instruction: "Ask if object is floating or submerged.",
      },
      {
        vessel_instruction: "Close call.",
        vessel_message: "Europe VTS, this is MV Sunrise. Out.",
        vts_message:
          "MV Sunrise, this is Europe VTS. RECEIVED. Object floating. Out.",
        vts_instruction: "Acknowledge and close the call.",
      },
    ],
  },
  {
    id: "36",
    name: "Getting underway without having received clearance",
    starter: "vts",
    turns: [
      {
        vessel_instruction:
          "You are aircraft carrier Sunrise. Answer Europe VTS.",
        vessel_message:
          "Europe VTS, this is aircraft carrier Sunrise listening on channel one eight. Over.",
        vts_message: "Aircraft carrier Sunrise, this is Europe VTS. Over.",
        vts_instruction: "You are Europe VTS. Call aircraft carrier Sunrise.",
      },
      {
        vessel_instruction:
          "Apologize and state intention to go to pilot station.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. We apologize for the oversight. We are proceeding to pilot station. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. According to my equipment, you have left berth without asking for permission. QUESTION. What is your intention? Over.",
        vts_instruction:
          "Tell Sunrise they left berth without permission. Ask for intentions. Use marker.",
      },
      {
        vessel_instruction: "Acknowledge wait for clearance.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. RECEIVED. Waiting for clearance. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. RECEIVED. REQUEST. Wait for further clearance before proceeding. Over.",
        vts_instruction:
          "Acknowledge and request they wait for further clearance.",
      },
      {
        vessel_instruction: "Close call.",
        vessel_message: "Europe VTS, this is MV Sunrise. Out.",
        vts_message: "MV Sunrise, this is Europe VTS. Out.",
        vts_instruction: "Close the call.",
      },
    ],
  },
  {
    id: "37",
    name: "Entering the TSS in a wrong way",
    starter: "vts",
    turns: [
      {
        vessel_instruction: "You are MV Sunrise. Answer Europe VTS.",
        vessel_message: "Europe VTS, this is MV Sunrise. Over.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
        vts_instruction: "You are Europe VTS. Call MV Sunrise.",
      },
      {
        vessel_instruction: "Request navigational assistance.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. RECEIVED. REQUEST. Provide navigational assistance. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. INFORMATION. You are entering the traffic separation scheme in the wrong way. Over.",
        vts_instruction:
          "Inform Sunrise (use marker) they are entering TSS in the wrong way.",
      },
      {
        vessel_instruction: "Acknowledge course alteration to NW.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. RECEIVED. Altering course to northwest. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. ADVICE. Alter course to northwest and proceed into the traffic separation scheme. Over.",
        vts_instruction:
          "Advise course change to NW directly into TSS. Use marker.",
      },
      {
        vessel_instruction: "Close call.",
        vessel_message: "Europe VTS, this is MV Sunrise. Out.",
        vts_message: "MV Sunrise, this is Europe VTS. Out.",
        vts_instruction: "Close the call.",
      },
    ],
  },
  {
    id: "38",
    name: "Approaching harbour with reduced visibility",
    starter: "vts",
    turns: [
      {
        vessel_instruction: "You are MV Sunrise. Answer Europe VTS.",
        vessel_message: "Europe VTS, this is MV Sunrise. Over.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
        vts_instruction: "Establish contact with MV Sunrise.",
      },
      {
        vessel_instruction: "Acknowledge traffic info.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. RECEIVED traffic information. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. Traffic information. Moonshine currently inbound to Atlantis harbour. Summer Breeze is scheduled for departure at two three one five local time. Over.",
        vts_instruction:
          "Give traffic: Moonshine inbound, Summer Breeze departing 23.15. Separate digits.",
      },
      {
        vessel_instruction: "Acknowledge caution.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. RECEIVED. Proceeding with caution. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. WARNING. Reduced visibility in harbour approach. ADVISE caution. Over.",
        vts_instruction: "Warn about reduced visibility. Advise caution.",
      },
      {
        vessel_instruction: "Close call.",
        vessel_message: "Europe VTS, this is MV Sunrise. Out.",
        vts_message: "MV Sunrise, this is Europe VTS. Out.",
        vts_instruction: "Close the call.",
      },
    ],
  },
  {
    id: "39",
    name: "Vessel not under command",
    starter: "vts",
    turns: [
      {
        vessel_instruction: "You are MV Sunrise. Answer VTS.",
        vessel_message: "Europe VTS, this is MV Sunrise. Over.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
        vts_instruction: "You are Europe VTS. Call MV Sunrise.",
      },
      {
        vessel_instruction: "Explain: stopped for maintenance.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. ANSWER. We stopped the engine to do some maintenance. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. INFORMATION. Your navigational status is set on NUC. QUESTION. Do you have any problem on board? Over.",
        vts_instruction:
          "Inform ship status is NUC on AIS. Ask about board problems. Use two markers.",
      },
      {
        vessel_instruction: "Confirm completion in 1 hour.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. ANSWER. Yes, maintenance will be completed in one hour. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. QUESTION. Will you solve the problem in one hour? Over.",
        vts_instruction:
          "Ask if they will solve the problem in one hour. Use marker.",
      },
      {
        vessel_instruction: "Acknowledge update request.",
        vessel_message: "Europe VTS, this is MV Sunrise. Out.",
        vts_message:
          "MV Sunrise, this is Europe VTS. REQUEST. Call back in one hour. Out.",
        vts_instruction: "Request update in one hour and close call.",
      },
    ],
  },
  {
    id: "40",
    name: "Drifting into territorial waters",
    starter: "vts",
    turns: [
      {
        vessel_instruction: "You are MV Sunrise. Answer VTS.",
        vessel_message:
          "Europe VTS. Sunrise, Victor seven Romeo Uniform three replying. Over.",
        vts_message: "MV Sunrise. Europe VTS. Do you read me? Over.",
        vts_instruction: "Establish contact with MV Sunrise.",
      },
      {
        vessel_instruction: "State: no info on voyage plan yet.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. For this information I will have to confirm with the Master. I have no information on plans to resume passage. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. QUESTION. When will you proceed with your voyage? Over.",
        vts_instruction: "Ask the ship when they will proceed. Use marker.",
      },
      {
        vessel_instruction: "Acknowledge drift and heading south.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. RECEIVED. Proceeding south. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. INFORMATION. You have drifted into territorial waters. Proceed south to stay clear. Over.",
        vts_instruction:
          "Inform ship they drifted into territorial waters. Order them south to stay clear.",
      },
      {
        vessel_instruction: "Close call.",
        vessel_message: "Europe VTS, this is MV Sunrise. Out.",
        vts_message: "MV Sunrise, this is Europe VTS. Out.",
        vts_instruction: "Close the call.",
      },
    ],
  },
  {
    id: "41",
    name: "Navigation in icy Arctic Navarea",
    starter: "vts",
    turns: [
      {
        vessel_instruction: "You are MV Sunrise. Answer VTS.",
        vessel_message: "Europe VTS, this is MV Sunrise. Over.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
        vts_instruction:
          "You are Europe VTS. Establish contact with MV Sunrise.",
      },
      {
        vessel_instruction: "State: Category C ship.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. Sunrise is a Category C ship. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. INFORMATION. You are entering Arctic NAVAREA XIX with sea-ice conditions. QUESTION. What is your ice class? Over.",
        vts_instruction:
          "Inform Sunrise entering Arctic NAVAREA XIX with ice. Ask for ice class. Use markers.",
      },
      {
        vessel_instruction: "Confirm receipt of ice forecast.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. ANSWER. Yes, we have received ice forecast. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. QUESTION. Have you received the ice forecast? Over.",
        vts_instruction: "Ask if Sunrise received ice forecast.",
      },
      {
        vessel_instruction: "Acknowledge assistance availability.",
        vessel_message: "Europe VTS, this is MV Sunrise. Out.",
        vts_message:
          "MV Sunrise, this is Europe VTS. INFORMATION. Icebreaker assistance is available. Out.",
        vts_instruction:
          "Inform that icebreaker assistance is available. Close the call.",
      },
    ],
  },
  {
    id: "42",
    name: "Operating with an icebreaker while in transit",
    starter: "vts",
    turns: [
      {
        vessel_instruction: "You are MV Sunrise. Answer VTS.",
        vessel_message: "Europe VTS, this is MV Sunrise. Over.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
        vts_instruction:
          "You are Europe VTS. Establish contact with MV Sunrise.",
      },
      {
        vessel_instruction: "Acknowledge icebreaker instructions.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. RECEIVED. Following icebreaker, moderate speed, standing by channel one six. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. INFORMATION. Icebreaker assistance starts now. Follow the icebreaker. Proceed at moderate speed. Stand by on VHF Channel one six. Over.",
        vts_instruction:
          "Notify start of icebreaker ops. Order them to follow, go moderate speed, stand by Ch 16.",
      },
      {
        vessel_instruction: "Close call.",
        vessel_message: "Europe VTS, this is MV Sunrise. Out.",
        vts_message: "MV Sunrise, this is Europe VTS. Out.",
        vts_instruction: "Close the call.",
      },
    ],
  },
  {
    id: "43",
    name: "Improper securing of deck timber cargo",
    starter: "vts",
    turns: [
      {
        vessel_instruction: "You are MV Sunrise. Answer VTS.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. I have lost timber deck cargo in position six zero degrees four three minutes North, two six degrees nine five minutes East. Over.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
        vts_instruction:
          "You are Europe VTS. Establish contact with MV Sunrise.",
      },
      {
        vessel_instruction: "State: logs are in loose form.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. ANSWER. The logs are in a loose form. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. QUESTION. Are the logs in a loose or packaged form? Over.",
        vts_instruction:
          "Ask Sunrise if logs are loose or packaged. Use marker.",
      },
      {
        vessel_instruction: "Confirm stability can be maintained.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. ANSWER. Yes, I am able to maintain stability. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. RECEIVED. The logs are in a loose form. QUESTION. Are you able to maintain stability? Over.",
        vts_instruction:
          "Read back info. Ask if stability is maintained. Use marker.",
      },
      {
        vessel_instruction: "State: steel ropes not required.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. ANSWER. No, I do not require steel ropes. Over.",
        vts_message:
          "MV Sunrise, this is Europe VTS. RECEIVED. QUESTION. Do you require steel ropes to secure the cargo? Over.",
        vts_instruction:
          "Ask if Sunrise requires steel ropes to secure cargo. Use marker.",
      },
      {
        vessel_instruction: "Acknowledge call back request.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. RECEIVED. Call back in one hour. Out.",
        vts_message:
          "MV Sunrise, this is Europe VTS. RECEIVED. You do not require steel ropes. REQUEST. Call back in one hour. Out.",
        vts_instruction: "Request update in 1 hour. Use marker. Close call.",
      },
    ],
  },
];
