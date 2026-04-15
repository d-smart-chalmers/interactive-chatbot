export const aScenarios = [
  {
    id: "1",
    name: "Providing information on a passage through a strait",
    participants: {
      starter: { role: "vessel", name: "MV Sunrise" },
      responder: { role: "vts", name: "Europe VTS" },
    },
    turns: [
      {
        vessel_instruction: "You are MV Sunrise. Call Europe VTS.",
        vessel_message: "Europe VTS, Europe VTS. This is MV Sunrise. Over.",
        vts_instruction: "You are Europe VTS. Answer MV Sunrise.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
      },
      {
        vessel_instruction:
          "Due to strong winds in Sandybay Strait, ask to increase speed from 10 knots.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. QUESTION. Do we have permission to increase speed from one zero knots due to strong winds in Sandybay Strait? Over.",
        vts_instruction: "Ask about current wind speed and direction.",
        vts_message:
          "MV Sunrise, this is Europe VTS. QUESTION. What is the current wind speed and direction? Over.",
      },
      {
        vessel_instruction: "Wind speed: 35 knots. Direction: North East.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. ANSWER. Wind speed is three five knots and north east direction. Over.",
        vts_instruction: "Ask if there are any fishing vessels nearby.",
        vts_message:
          "MV Sunrise, this is Europe VTS. QUESTION. Are there any fishing vessels in your vicinity? Over.",
      },
      {
        vessel_instruction: "There are no fishing vessels nearby.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. ANSWER. No fishing vessels in the vicinity. Over.",
        vts_instruction: "Grant permission to increase speed.",
        vts_message:
          "MV Sunrise, this is Europe VTS. INFORMATION. You have permission to increase speed. Over.",
      },
      {
        vessel_instruction:
          "Acknowledge the permission and close the communication.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. RECEIVED. Permission to increase speed. Out.",
      },
    ],
  },
  /*
  {
    id: "2",
    name: "Providing and reading back anchoring position coordinates",
    starter: "vts",
    turns: [
      {
        vts_instruction: "Call MV Sunrise.",
        vts_message: "MV Sunrise, MV Sunrise. This is Europe VTS. Over.",
        vessel_instruction: "Answer Europe VTS.",
        vessel_message: "Europe VTS, this is MV Sunrise. Over.",
      },
      {
        vts_instruction: "Advise MV Sunrise to anchor at position Bravo three.",
        vts_message:
          "MV Sunrise, this is Europe VTS. ADVICE. Anchor at Bravo three. Over.",
        vessel_instruction: "Ask for the specific coordinates of Bravo three.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. QUESTION. What is the position of Bravo three? Over.",
      },
      {
        vts_instruction:
          "Provide the coordinates (45° 34.30' N, 013° 41.75' E) and ask for a readback.",
        vts_message:
          "MV Sunrise, this is Europe VTS. ANSWER. The position of Bravo three is four five degrees three four decimal three zero minutes north, zero one three degrees four one decimal seven five minutes east. Read back. Over.",
        vessel_instruction: "Read back the coordinates provided by VTS.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. Bravo three is in position four five degrees three four decimal three zero minutes north, zero one three degrees four one decimal seven five minutes east. Over.",
      },
      {
        vts_instruction: "Confirm the readback is correct and close the call.",
        vts_message: "MV Sunrise, this is Europe VTS. Correct. Out.",
      },
    ],
  },
  {
    id: "3",
    name: "Vessel enters VTS area and must drop anchor to wait for pilot",
    starter: "vessel",
    turns: [
      {
        vessel_instruction: "Call Europe VTS.",
        vessel_message: "Europe VTS, Europe VTS. This is MV Sunrise. Over.",
        vts_instruction: "Answer MV Sunrise.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
      },
      {
        vessel_instruction:
          "State you are entering the area bound for Atlantis and request a pilot.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. We are entering the VTS area bound for Atlantis. Request pilot. Over.",
        vts_instruction:
          "Ask for the vessel's call sign, flag, draft, and destination berth.",
        vts_message:
          "MV Sunrise, this is Europe VTS. QUESTION. What is your call sign, flag, draft and destination berth? Over.",
      },
      {
        vessel_instruction:
          "Provide particulars: Call sign V7RU3, Greek flag, draft 8.5m, Atlantis Pier 3.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. ANSWER. My call sign is Victor seven Romeo Uniform three. Greek flag. Draft eight decimal five metres. Destination berth is Atlantis pier three. Over.",
        vts_instruction:
          "Advise the vessel to proceed to anchorage area Alpha and wait for the pilot.",
        vts_message:
          "MV Sunrise, this is Europe VTS. ADVICE. Proceed to anchorage area Alpha and wait for pilot. Over.",
      },
      {
        vessel_instruction: "Acknowledge the instruction and close the call.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. RECEIVED. We will proceed to anchorage area Alpha and wait for pilot. Out.",
      },
    ],
  },
  {
    id: "4",
    name: "Vessel ready to departure calls to ask clearance",
    starter: "vessel",
    turns: [
      {
        vessel_instruction: "Call Europe VTS.",
        vessel_message: "Europe VTS, Europe VTS. This is MV Sunrise. Over.",
        vts_instruction: "Answer MV Sunrise.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
      },
      {
        vessel_instruction:
          "State you are ready to depart and request clearance.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. INFORMATION. We are ready to depart. Request clearance for departure. Over.",
        vts_instruction:
          "Grant permission to depart and tell them to watch VHF channels 16 and 14.",
        vts_message:
          "MV Sunrise, this is Europe VTS. INFORMATION. You have permission to depart. Stand by on VHF channels one six and one four. Over.",
      },
      {
        vessel_instruction:
          "Acknowledge the clearance and frequencies, then close.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. RECEIVED. Permission to depart. Standing by on channels one six and one four. Out.",
      },
    ],
  },
  {
    id: "5",
    name: "Entering the reporting zone",
    starter: "vessel",
    turns: [
      {
        vessel_instruction: "Call Europe VTS.",
        vessel_message: "Europe VTS, Europe VTS. This is MV Sunrise. Over.",
        vts_instruction: "Answer MV Sunrise.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
      },
      {
        vessel_instruction: "Report that you are entering the reporting zone.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. INFORMATION. We are entering your reporting zone. Over.",
        vts_instruction: "Acknowledge and ask for position.",
        vts_message:
          "MV Sunrise, this is Europe VTS. RECEIVED. QUESTION. What is your position? Over.",
      },
      {
        vessel_instruction: "Provide position: 45° 30' N, 013° 35' E.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. ANSWER. My position is four five degrees three zero minutes North, zero one three degrees three five minutes East. Over.",
        vts_instruction: "Ask for course and speed.",
        vts_message:
          "MV Sunrise, this is Europe VTS. QUESTION. What is your course and speed? Over.",
      },
      {
        vessel_instruction:
          "Provide course (270°) and speed (12 knots), then close.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. ANSWER. Course two seven zero, speed one two knots. Out.",
      },
    ],
  },
  {
    id: "6",
    name: "Vessel in transit to pilot station",
    starter: "vessel",
    turns: [
      {
        vessel_instruction: "Call Europe VTS.",
        vessel_message: "Europe VTS, Europe VTS. This is MV Sunrise. Over.",
        vts_instruction: "Answer MV Sunrise.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
      },
      {
        vessel_instruction:
          "Report entering from the west, in transit to the pilot station for 13:00.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. We are entering your VTS area from the west. In transit, proceeding to pilot station. Pilot boarding time one three zero zero. Over.",
        vts_instruction: "Acknowledge and inform them there is no traffic.",
        vts_message:
          "MV Sunrise, this is Europe VTS. RECEIVED. INFORMATION. No traffic information for you. Over.",
      },
      {
        vessel_instruction: "Ask if the pilot will board from the shoreside.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. QUESTION. Will pilot board from shoreside? Over.",
        vts_instruction:
          "Confirm shoreside boarding and instruct to call Ch 13 one hour before ETA.",
        vts_message:
          "MV Sunrise, this is Europe VTS. ANSWER. Pilot will board from shoreside. INSTRUCTION. Call pilot station on channel one three, one hour prior to ETA. Over.",
      },
      {
        vessel_instruction:
          "Acknowledge instruction, confirm watch on Ch 14/16, and close.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. RECEIVED. We will call pilot station one hour prior. Stand by on one four and one six. Out.",
      },
    ],
  },
  {
    id: "7",
    name: "Traffic information on permission to drift",
    starter: "vessel",
    turns: [
      {
        vessel_instruction: "Call Europe VTS.",
        vessel_message: "Europe VTS, Europe VTS. This is MV Sunrise. Over.",
        vts_instruction: "Answer MV Sunrise.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
      },
      {
        vessel_instruction: "Request permission to drift.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. Request permission to drift in position. Over.",
        vts_instruction: "Ask for the reason.",
        vts_message:
          "MV Sunrise, this is Europe VTS. QUESTION. What is the reason for drifting? Over.",
      },
      {
        vessel_instruction: "State you have engine trouble.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. ANSWER. We have engine trouble. Over.",
        vts_instruction: "Grant permission and request update in one hour.",
        vts_message:
          "MV Sunrise, this is Europe VTS. INFORMATION. Permission granted to drift. REQUEST. Call back in one hour. Over.",
      },
      {
        vessel_instruction: "Acknowledge and close.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. RECEIVED. We will call back in one hour. Out.",
      },
    ],
  },
  {
    id: "8",
    name: "Tugboat outbound to escort incoming vessel to berth",
    starter: "vessel",
    turns: [
      {
        vessel_instruction: "You are Tug Sunrise. Call Europe VTS.",
        vessel_message: "Europe VTS, Europe VTS. This is tug Sunrise. Over.",
        vts_instruction: "Answer Tug Sunrise.",
        vts_message: "Tug Sunrise, this is Europe VTS. Over.",
      },
      {
        vessel_instruction: "Report outbound to escort MV Atlantic to berth 5.",
        vessel_message:
          "Europe VTS, this is tug Sunrise. INFORMATION. We are outbound to escort MV Atlantic to berth five. Over.",
        vts_instruction: "Ask for ETA to meeting point.",
        vts_message:
          "Tug Sunrise, this is Europe VTS. RECEIVED. QUESTION. What is your ETA to the meeting point? Over.",
      },
      {
        vessel_instruction: "Provide ETA: 14:30 local time.",
        vessel_message:
          "Europe VTS, this is tug Sunrise. ANSWER. ETA to meeting point is one four three zero local time. Over.",
        vts_instruction: "Inform about outbound vessel MV Pacific.",
        vts_message:
          "Tug Sunrise, this is Europe VTS. INFORMATION. MV Pacific is outbound. Over.",
      },
      {
        vessel_instruction: "Acknowledge traffic and close.",
        vessel_message:
          "Europe VTS, this is tug Sunrise. RECEIVED. Looking out for MV Pacific. Out.",
      },
    ],
  },
  {
    id: "9",
    name: "Vessel entering VTS area, in transit",
    starter: "vessel",
    turns: [
      {
        vessel_instruction: "Call Europe VTS.",
        vessel_message: "Europe VTS, Europe VTS. This is MV Sunrise. Over.",
        vts_instruction: "Answer MV Sunrise.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
      },
      {
        vessel_instruction: "Report entering in transit to Hamburg.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. INFORMATION. We are entering VTS area in transit to Hamburg. Over.",
        vts_instruction: "Ask for ETA to exit point.",
        vts_message:
          "MV Sunrise, this is Europe VTS. RECEIVED. QUESTION. What is your ETA to exit point? Over.",
      },
      {
        vessel_instruction: "Provide ETA: 18:00 local time.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. ANSWER. ETA to exit point is one eight zero zero local time. Over.",
        vts_instruction: "Instruct to watch Ch 16 and close.",
        vts_message:
          "MV Sunrise, this is Europe VTS. RECEIVED. Stand by on channel one six. Out.",
      },
    ],
  },
  {
    id: "10",
    name: "Leaving the TSS",
    starter: "vessel",
    turns: [
      {
        vessel_instruction: "Call Europe VTS.",
        vessel_message: "Europe VTS, Europe VTS. This is MV Sunrise. Over.",
        vts_instruction: "Answer MV Sunrise.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
      },
      {
        vessel_instruction:
          "Report you are leaving the Traffic Separation Scheme.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. INFORMATION. We are leaving the traffic separation scheme. Over.",
        vts_instruction: "Acknowledge and wish them safe voyage.",
        vts_message:
          "MV Sunrise, this is Europe VTS. RECEIVED. Have a safe voyage. Out.",
      },
    ],
  },
  {
    id: "11",
    name: "Vessel underway with pilot onboard",
    starter: "vessel",
    turns: [
      {
        vessel_instruction: "Call Europe VTS.",
        vessel_message: "Europe VTS, Europe VTS. This is MV Sunrise. Over.",
        vts_instruction: "Answer MV Sunrise.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
      },
      {
        vessel_instruction:
          "Report anchor up and proceeding to Pilot Station 1.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. INFORMATION. My anchor is up from X-ray one, and we are underway, proceeding to Pilot Station one. Over.",
        vts_instruction:
          "Instruct to wait in position and not to get underway.",
        vts_message:
          "MV Sunrise, this is Europe VTS. INSTRUCTION. Wait in position, do not get underway. I repeat. Wait in position until further instructions. Over.",
      },
      {
        vessel_instruction: "Acknowledge wait and ask for delay duration.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. RECEIVED. QUESTION. How long will we wait? Over.",
        vts_instruction: "Inform that pilot boarding is at 11:00.",
        vts_message:
          "MV Sunrise, this is Europe VTS. INFORMATION. The pilot boarding time is one one zero zero local time. Over.",
      },
      {
        vessel_instruction:
          "Confirm boarding time and wait in position, then close.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. RECEIVED. Pilot boarding time one one zero zero. We wait in position. Out.",
      },
    ],
  },
  {
    id: "12",
    name: "Vessel entering VTS area bound for berth place and asking for information",
    starter: "vessel",
    turns: [
      {
        vessel_instruction: "Call Europe VTS.",
        vessel_message: "Europe VTS, Europe VTS. This is MV Sunrise. Over.",
        vts_instruction: "Answer MV Sunrise.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
      },
      {
        vessel_instruction:
          "State you are bound for Atlantis berth 3 and request berthing info.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. We are entering VTS area bound for Atlantis berth three. Request information on berthing. Over.",
        vts_instruction: "Inform pilot boards at 10:00 and tug is available.",
        vts_message:
          "MV Sunrise, this is Europe VTS. INFORMATION. Pilot will board at one zero zero zero. Tug assistance is available. Over.",
      },
      {
        vessel_instruction: "Acknowledge and close.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. RECEIVED. Pilot at one zero zero zero. Tug available. Out.",
      },
    ],
  },
  {
    id: "13",
    name: "Mandatory ship reporting",
    starter: "vessel",
    turns: [
      {
        vessel_instruction: "Call Europe VTS.",
        vessel_message: "Europe VTS, Europe VTS. This is MV Sunrise. Over.",
        vts_instruction: "Answer MV Sunrise.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
      },
      {
        vessel_instruction:
          "Provide mandatory report: Pos 45N 013E, Course 180, Speed 14, Dest Rotterdam, ETA 06:00.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. Making mandatory report. Position four five degrees three zero minutes North, zero one three degrees four zero minutes East. Course one eight zero, speed one four knots. Destination Rotterdam. ETA zero six zero zero tomorrow. Over.",
        vts_instruction: "Read back the report.",
        vts_message:
          "MV Sunrise, this is Europe VTS. RECEIVED. Position four five degrees three zero minutes North, zero one three degrees four zero minutes East. Course one eight zero, speed one four knots. Destination Rotterdam. ETA zero six zero zero. Over.",
      },
      {
        vessel_instruction: "Confirm and close.",
        vessel_message: "Europe VTS, this is MV Sunrise. Correct. Out.",
      },
    ],
  },
  {
    id: "14",
    name: "Tug operations with barge in tow",
    starter: "vessel",
    turns: [
      {
        vessel_instruction: "You are Tug Sunrise. Call Europe VTS.",
        vessel_message: "Europe VTS, Europe VTS. This is tug Sunrise. Over.",
        vts_instruction: "Answer Tug Sunrise.",
        vts_message: "Tug Sunrise, this is Europe VTS. Over.",
      },
      {
        vessel_instruction: "Report entering with 200m tow.",
        vessel_message:
          "Europe VTS, this is tug Sunrise with barge in tow. INFORMATION. We are entering VTS area. Length of tow two hundred metres. Over.",
        vts_instruction: "Ask for destination.",
        vts_message:
          "Tug Sunrise, this is Europe VTS. RECEIVED. QUESTION. What is your destination? Over.",
      },
      {
        vessel_instruction: "State destination is Atlantis berth 7.",
        vessel_message:
          "Europe VTS, this is tug Sunrise. ANSWER. Destination is Atlantis port, berth seven. Over.",
        vts_instruction: "Inform no traffic and close.",
        vts_message:
          "Tug Sunrise, this is Europe VTS. RECEIVED. INFORMATION. No traffic information for you. Out.",
      },
    ],
  },
  {
    id: "15",
    name: "VTS grants the ship permission to enter the bay",
    starter: "vessel",
    turns: [
      {
        vessel_instruction: "Call Europe VTS.",
        vessel_message: "Europe VTS, Europe VTS. This is MV Sunrise. Over.",
        vts_instruction: "Answer MV Sunrise.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
      },
      {
        vessel_instruction: "Request permission to enter the bay.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. Request permission to enter the bay. Over.",
        vts_instruction: "Grant permission.",
        vts_message:
          "MV Sunrise, this is Europe VTS. INFORMATION. You have permission to enter the bay. Over.",
      },
      {
        vessel_instruction: "Acknowledge and close.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. RECEIVED. Permission to enter. Out.",
      },
    ],
  },
  {
    id: "16",
    name: "Traffic and anchoring information",
    starter: "vessel",
    turns: [
      {
        vessel_instruction: "Call Europe VTS.",
        vessel_message: "Europe VTS, Europe VTS. This is MV Sunrise. Over.",
        vts_instruction: "Answer MV Sunrise.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
      },
      {
        vessel_instruction: "Request anchoring info and traffic update.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. Request anchoring information and traffic update. Over.",
        vts_instruction: "Assign Alpha 1 and report one vessel outbound.",
        vts_message:
          "MV Sunrise, this is Europe VTS. INFORMATION. Anchoring area is Alpha one. One vessel outbound. Over.",
      },
      {
        vessel_instruction: "Acknowledge and close.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. RECEIVED. Alpha one and one vessel outbound. Out.",
      },
    ],
  },
  {
    id: "17",
    name: "Is the vessel AIS operational?",
    starter: "vts",
    turns: [
      {
        vts_instruction: "Call MV Sunrise.",
        vts_message: "MV Sunrise, MV Sunrise. This is Europe VTS. Over.",
        vessel_instruction: "Answer Europe VTS.",
        vessel_message: "Europe VTS, this is MV Sunrise. Over.",
      },
      {
        vts_instruction: "Ask if AIS is operational.",
        vts_message:
          "MV Sunrise, this is Europe VTS. QUESTION. Is your AIS operational? Over.",
        vessel_instruction: "Confirm AIS is operational.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. ANSWER. Yes, AIS is operational. Over.",
      },
      {
        vts_instruction: "Acknowledge and close.",
        vts_message: "MV Sunrise, this is Europe VTS. RECEIVED. Out.",
      },
    ],
  },
  {
    id: "18",
    name: "VTS requires ETA, cargo quantity information and number of crew",
    starter: "vts",
    turns: [
      {
        vts_instruction: "Call MV Sunrise.",
        vts_message: "MV Sunrise, MV Sunrise. This is Europe VTS. Over.",
        vessel_instruction: "Answer Europe VTS.",
        vessel_message: "Europe VTS, this is MV Sunrise. Over.",
      },
      {
        vts_instruction: "Ask for ETA, cargo, and crew count.",
        vts_message:
          "MV Sunrise, this is Europe VTS. QUESTION. What is your ETA, cargo quantity, and number of crew? Over.",
        vessel_instruction: "Report: ETA 14:00, 5000t cargo, 20 crew.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. ANSWER. ETA one four zero zero, cargo five thousand tons, crew two zero persons. Over.",
      },
      {
        vts_instruction: "Acknowledge and close.",
        vts_message: "MV Sunrise, this is Europe VTS. RECEIVED. Out.",
      },
    ],
  },
  {
    id: "19",
    name: "Asking for ship particulars and ETA",
    starter: "vts",
    turns: [
      {
        vts_instruction: "Call MV Sunrise.",
        vts_message: "MV Sunrise, MV Sunrise. This is Europe VTS. Over.",
        vessel_instruction: "Answer Europe VTS.",
        vessel_message: "Europe VTS, this is MV Sunrise. Over.",
      },
      {
        vts_instruction: "Ask for name, call sign, flag, and ETA.",
        vts_message:
          "MV Sunrise, this is Europe VTS. QUESTION. What is your name, call sign, flag, and ETA? Over.",
        vessel_instruction:
          "Provide name (Sunrise), call sign (V7RU3), flag (Malta), and ETA (16:00).",
        vessel_message:
          "Europe VTS, this is MV Sunrise. ANSWER. Ship name Sunrise, call sign Victor seven Romeo Uniform three, Malta flag, ETA one six zero zero. Over.",
      },
      {
        vts_instruction: "Acknowledge and close.",
        vts_message: "MV Sunrise, this is Europe VTS. RECEIVED. Out.",
      },
    ],
  },
  {
    id: "20",
    name: "Informing VTS about dangerous cargo type and quantity",
    starter: "vessel",
    turns: [
      {
        vessel_instruction: "Call Europe VTS.",
        vessel_message: "Europe VTS, Europe VTS. This is MV Sunrise. Over.",
        vts_instruction: "Answer MV Sunrise.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
      },
      {
        vessel_instruction: "Report 500 tons of Class 3 dangerous cargo.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. INFORMATION. We are carrying dangerous cargo, Class three, quantity five hundred tons. Over.",
        vts_instruction: "Acknowledge report.",
        vts_message:
          "MV Sunrise, this is Europe VTS. RECEIVED. INFORMATION. Dangerous cargo Class three, five hundred tons. Over.",
      },
      {
        vessel_instruction: "Confirm and close.",
        vessel_message: "Europe VTS, this is MV Sunrise. Correct. Out.",
      },
    ],
  },
  {
    id: "21",
    name: "Approaching port",
    starter: "vessel",
    turns: [
      {
        vessel_instruction: "Call Europe VTS.",
        vessel_message: "Europe VTS, Europe VTS. This is MV Sunrise. Over.",
        vts_instruction: "Answer MV Sunrise.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
      },
      {
        vessel_instruction:
          "Report passing reporting point and state cargo is MTBE.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. INFORMATION. Passing reporting point. Cargo is MTBE. Over.",
        vts_instruction: "Ask for cargo quantity.",
        vts_message:
          "MV Sunrise, this is Europe VTS. RECEIVED. QUESTION. What is the quantity of cargo on board? Over.",
      },
      {
        vessel_instruction: "State quantity: 4990.052t, Class 3.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. ANSWER. Quantity four nine nine zero decimal zero five two metric tons. Class three. Over.",
        vts_instruction: "Read back quantity and ask for arrival draft.",
        vts_message:
          "MV Sunrise, this is Europe VTS. RECEIVED. Four nine nine zero decimal zero five two tons. QUESTION. What is your draft on arrival? Over.",
      },
      {
        vessel_instruction: "State draft: 7.05m.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. ANSWER. Draft seven decimal zero five metres. Over.",
        vts_instruction: "Ask for bunkers (fuel, diesel, lube oil) on board.",
        vts_message:
          "MV Sunrise, this is Europe VTS. QUESTION. What is the quantity of bunkers? Fuel oil, diesel oil, lube oil? Over.",
      },
      {
        vessel_instruction: "State: Diesel 90.81, Lube 8005L, Fuel 135.16t.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. ANSWER. Diesel nine zero decimal eight one, lube eight zero zero five litres, fuel one three five decimal one six tons. Over.",
        vts_instruction: "Ask for number of persons on board.",
        vts_message:
          "MV Sunrise, this is Europe VTS. RECEIVED. QUESTION. What is the number of persons on board? Over.",
      },
      {
        vessel_instruction: "State 14 persons and ETA 05:00.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. ANSWER. One four persons on board. ETA zero five zero zero hours. Over.",
        vts_instruction:
          "Advise contact on Ch 09 1.5h before arrival and close.",
        vts_message:
          "MV Sunrise, this is Europe VTS. ADVICE. Contact Sandybay Traffic one and a half hours before arrival on channel zero nine. Out.",
      },
    ],
  },
  {
    id: "22",
    name: "Vessel at anchor, preparing to get underway",
    starter: "vessel",
    turns: [
      {
        vessel_instruction: "Call Europe VTS.",
        vessel_message: "Europe VTS, Europe VTS. This is MV Sunrise. Over.",
        vts_instruction: "Answer MV Sunrise.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
      },
      {
        vessel_instruction:
          "Report at anchor and request permission to get underway.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. INFORMATION. At anchor, preparing to get underway. Request permission. Over.",
        vts_instruction: "Grant permission.",
        vts_message:
          "MV Sunrise, this is Europe VTS. INFORMATION. You have permission to get underway. Over.",
      },
      {
        vessel_instruction: "Acknowledge and close.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. RECEIVED. Permission to get underway. Out.",
      },
    ],
  },
  {
    id: "23",
    name: "Entering the VTS area, underway to anchor for bunkering",
    starter: "vessel",
    turns: [
      {
        vessel_instruction: "Call Europe VTS.",
        vessel_message: "Europe VTS, Europe VTS. This is MV Sunrise. Over.",
        vts_instruction: "Answer MV Sunrise.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
      },
      {
        vessel_instruction: "Report entering area to anchor for bunkering.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. Entering VTS area, proceeding to anchorage for bunkering. Over.",
        vts_instruction: "Assign anchorage Bravo 2.",
        vts_message:
          "MV Sunrise, this is Europe VTS. INSTRUCTION. Proceed to anchorage area Bravo two for bunkering. Over.",
      },
      {
        vessel_instruction: "Acknowledge and close.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. RECEIVED. Bravo two. Out.",
      },
    ],
  },
  {
    id: "24",
    name: "Sending the passage plan",
    starter: "vessel",
    turns: [
      {
        vessel_instruction: "Call Europe VTS.",
        vessel_message: "Europe VTS, Europe VTS. This is MV Sunrise. Over.",
        vts_instruction: "Answer MV Sunrise.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
      },
      {
        vessel_instruction: "Inform that passage plan was emailed.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. INFORMATION. I have sent the passage plan via email. Over.",
        vts_instruction: "Confirm receipt.",
        vts_message:
          "MV Sunrise, this is Europe VTS. INFORMATION. Your passage plan has been RECEIVED. Over.",
      },
      {
        vessel_instruction: "Acknowledge and close.",
        vessel_message: "Europe VTS, this is MV Sunrise. RECEIVED. Out.",
      },
    ],
  },
  {
    id: "25",
    name: "Permission to start bunkering operations",
    starter: "vessel",
    turns: [
      {
        vessel_instruction: "Call Europe VTS.",
        vessel_message: "Europe VTS, Europe VTS. This is MV Sunrise. Over.",
        vts_instruction: "Answer MV Sunrise.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
      },
      {
        vessel_instruction: "Request permission to start bunkering.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. Request permission to start bunkering operations. Over.",
        vts_instruction: "Grant permission.",
        vts_message:
          "MV Sunrise, this is Europe VTS. INFORMATION. You have permission to start bunkering. Over.",
      },
      {
        vessel_instruction: "Acknowledge and close.",
        vessel_message: "Europe VTS, this is MV Sunrise. RECEIVED. Out.",
      },
    ],
  },
  {
    id: "26",
    name: "Carriage of dangerous goods",
    starter: "vts",
    turns: [
      {
        vts_instruction: "Call MV Sunrise.",
        vts_message: "MV Sunrise, MV Sunrise. This is Europe VTS. Over.",
        vessel_instruction: "Answer Europe VTS.",
        vessel_message: "Europe VTS, this is MV Sunrise. Over.",
      },
      {
        vts_instruction: "Ask if carrying dangerous goods.",
        vts_message:
          "MV Sunrise, this is Europe VTS. QUESTION. Are you carrying any dangerous goods? Over.",
        vessel_instruction: "Confirm Class 2, 100 tons.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. ANSWER. Yes, Class two dangerous goods, one hundred tons. Over.",
      },
      {
        vts_instruction: "Acknowledge and close.",
        vts_message: "MV Sunrise, this is Europe VTS. RECEIVED. Out.",
      },
    ],
  },
  {
    id: "27",
    name: "Arrival of pilot and preparations for berthing",
    starter: "vessel",
    turns: [
      {
        vessel_instruction: "Call Europe VTS.",
        vessel_message: "Europe VTS, Europe VTS. This is MV Sunrise. Over.",
        vts_instruction: "Answer MV Sunrise.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
      },
      {
        vessel_instruction:
          "Report pilot on board and berthing preps complete.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. INFORMATION. Pilot on board. Preparations for berthing complete. Over.",
        vts_instruction: "Grant permission to proceed to berth.",
        vts_message:
          "MV Sunrise, this is Europe VTS. INFORMATION. You have permission to proceed to berth. Over.",
      },
      {
        vessel_instruction: "Acknowledge and close.",
        vessel_message: "Europe VTS, this is MV Sunrise. RECEIVED. Out.",
      },
    ],
  },
  {
    id: "28",
    name: "Pilot transfer arrangements",
    starter: "vessel",
    turns: [
      {
        vessel_instruction: "Call Europe VTS.",
        vessel_message: "Europe VTS, Europe VTS. This is MV Sunrise. Over.",
        vts_instruction: "Answer MV Sunrise.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
      },
      {
        vessel_instruction: "Ask for pilot transfer arrangements.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. QUESTION. What are the pilot transfer arrangements? Over.",
        vts_instruction: "State ladder on starboard, 2m above water.",
        vts_message:
          "MV Sunrise, this is Europe VTS. INFORMATION. Pilot ladder on starboard side, two metres above water. Over.",
      },
      {
        vessel_instruction: "Acknowledge and close.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. RECEIVED. Starboard side, two metres. Out.",
      },
    ],
  },
  {
    id: "29",
    name: "VTS conveys pilot boarding information",
    starter: "vts",
    turns: [
      {
        vts_instruction: "Call MV Sunrise.",
        vts_message: "MV Sunrise, MV Sunrise. This is Europe VTS. Over.",
        vessel_instruction: "Answer Europe VTS.",
        vessel_message: "Europe VTS, this is MV Sunrise. Over.",
      },
      {
        vts_instruction: "State pilot boards at 09:30 at station Alpha.",
        vts_message:
          "MV Sunrise, this is Europe VTS. INFORMATION. Pilot boarding time zero nine three zero at station Alpha. Over.",
        vessel_instruction: "Acknowledge and close.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. RECEIVED. Station Alpha at zero nine three zero. Out.",
      },
    ],
  },
  {
    id: "30",
    name: "Tugboat report",
    starter: "vessel",
    turns: [
      {
        vessel_instruction: "You are Tug Sunrise. Call Europe VTS.",
        vessel_message: "Europe VTS, Europe VTS. This is tug Sunrise. Over.",
        vts_instruction: "Answer Tug Sunrise.",
        vts_message: "Tug Sunrise, this is Europe VTS. Over.",
      },
      {
        vessel_instruction: "Report towing is complete.",
        vessel_message:
          "Europe VTS, this is tug Sunrise. REPORT. Towing operation completed successfully. Over.",
        vts_instruction: "Acknowledge and close.",
        vts_message: "Tug Sunrise, this is Europe VTS. RECEIVED report. Out.",
      },
    ],
  },
  */
];

export const bScenarios = [
  {
    id: "31",
    name: "Checking a reported spillage",
    starter: "vts",
    participants: {
      starter: { role: "vts", name: "Europe VTS" },
      responder: { role: "vessel", name: "MV Sunrise" },
    },
    turns: [
      {
        vts_instruction: "Call MV Sunrise.",
        vts_message: "MV Sunrise, MV Sunrise. This is Europe VTS. Over.",
        vessel_instruction: "Answer Europe VTS.",
        vessel_message: "Europe VTS, this is MV Sunrise. Over.",
      },
      {
        vts_instruction:
          "Request MV Sunrise check for a spill alongside vessel.",
        vts_message:
          "MV Sunrise, this is Europe VTS. REQUEST. Check reported spillage alongside your vessel. Over.",
        vessel_instruction: "Ask if spill is at bow.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. QUESTION. Is the reported spillage at the bow section? Over.",
      },
      {
        vts_instruction: "Confirm spill is at bow.",
        vts_message:
          "MV Sunrise, this is Europe VTS. ANSWER. Yes, the reported spillage is at the bow section. Over.",
        vessel_instruction: "Confirm check and standby.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. INTENTION. I will check and report. Stand by. Out.",
      },
    ],
  } /*
  {
    id: "32",
    name: "Vessel must reduce excessive speed",
    starter: "vts",
    turns: [
      {
        vts_instruction: "Call MV Sunrise.",
        vts_message: "MV Sunrise, MV Sunrise. This is Europe VTS. Over.",
        vessel_instruction: "Answer Europe VTS.",
        vessel_message: "Europe VTS, this is MV Sunrise. Over.",
      },
      {
        vts_instruction: "Warn speed is high and instruct to slow to 10 knots.",
        vts_message:
          "MV Sunrise, this is Europe VTS. WARNING. Your speed is excessive. INSTRUCTION. Reduce speed to one zero knots. Over.",
        vessel_instruction: "Acknowledge and close.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. RECEIVED. Reducing to one zero knots. Out.",
      },
    ],
  },
  {
    id: "33",
    name: "Vessel navigating in a narrow waterway",
    starter: "vts",
    turns: [
      {
        vts_instruction: "Call MV Sunrise.",
        vts_message: "MV Sunrise, MV Sunrise. This is Europe VTS. Over.",
        vessel_instruction: "Answer Europe VTS.",
        vessel_message: "Europe VTS, this is MV Sunrise. Over.",
      },
      {
        vts_instruction: "Warn to stay starboard of channel.",
        vts_message:
          "MV Sunrise, this is Europe VTS. WARNING. Keep to starboard side of the channel. Over.",
        vessel_instruction: "Acknowledge and close.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. RECEIVED. Staying starboard. Out.",
      },
    ],
  },
  {
    id: "34",
    name: "Vessel adrift due to unstable weather forecast",
    starter: "vts",
    turns: [
      {
        vts_instruction: "Call MV Sunrise.",
        vts_message: "MV Sunrise, MV Sunrise. This is Europe VTS. Over.",
        vessel_instruction: "Answer Europe VTS.",
        vessel_message: "Europe VTS, this is MV Sunrise. Over.",
      },
      {
        vts_instruction: "Ask for reason for drifting.",
        vts_message:
          "MV Sunrise, this is Europe VTS. QUESTION. What is the reason for drifting? Over.",
        vessel_instruction: "State waiting for weather to improve.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. ANSWER. Waiting for weather to improve. Over.",
      },
      {
        vts_instruction: "Inform weather is improving and can proceed in 2h.",
        vts_message:
          "MV Sunrise, this is Europe VTS. INFORMATION. Weather improving. You may proceed in two hours. Over.",
        vessel_instruction: "Acknowledge and close.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. RECEIVED. Proceed in two hours. Out.",
      },
    ],
  },
  {
    id: "35",
    name: "Strange object in the fairway",
    starter: "vts",
    turns: [
      {
        vts_instruction: "Call MV Sunrise.",
        vts_message: "MV Sunrise, MV Sunrise. This is Europe VTS. Over.",
        vessel_instruction: "Answer Europe VTS.",
        vessel_message: "Europe VTS, this is MV Sunrise. Over.",
      },
      {
        vts_instruction: "Inform of unknown object at 2.3 miles and ask type.",
        vts_message:
          "MV Sunrise, this is Europe VTS. INFORMATION. Unknown object in fairway at distance two decimal three miles. QUESTION. What type of object? Over.",
        vessel_instruction: "State cannot see with lights.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. ANSWER. We cannot see even with lights. Over.",
      },
      {
        vts_instruction: "Ask if floating or submerged.",
        vts_message:
          "MV Sunrise, this is Europe VTS. QUESTION. Is object floating or submerged? Over.",
        vessel_instruction: "State appears floating and close call.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. ANSWER. Appears floating. Out.",
      },
    ],
  },
  {
    id: "36",
    name: "Getting underway without having RECEIVED clearance",
    starter: "vts",
    turns: [
      {
        vts_instruction: "Call Aircraft Carrier Sunrise.",
        vts_message:
          "Aircraft carrier Sunrise, Aircraft carrier Sunrise. This is Europe VTS. Over.",
        vessel_instruction: "Answer on Ch 18.",
        vessel_message:
          "Europe VTS, this is aircraft carrier Sunrise listening on channel one eight. Over.",
      },
      {
        vts_instruction:
          "Warn they left berth without permission and ask intentions.",
        vts_message:
          "Aircraft carrier Sunrise, this is Europe VTS. WARNING. You left berth without permission. QUESTION. What is your intention? Over.",
        vessel_instruction: "Apologize and state proceeding to pilot station.",
        vessel_message:
          "Europe VTS, this is aircraft carrier Sunrise. INTENTION. Proceeding to pilot station. Over.",
      },
      {
        vts_instruction: "Instruct to wait for clearance.",
        vts_message:
          "Aircraft carrier Sunrise, this is Europe VTS. INSTRUCTION. Wait for further clearance. Over.",
        vessel_instruction: "Acknowledge and close.",
        vessel_message:
          "Europe VTS, this is aircraft carrier Sunrise. RECEIVED. Out.",
      },
    ],
  },
  {
    id: "37",
    name: "Entering the TSS in a wrong way",
    starter: "vts",
    turns: [
      {
        vts_instruction: "Call MV Sunrise.",
        vts_message: "MV Sunrise, MV Sunrise. This is Europe VTS. Over.",
        vessel_instruction: "Answer Europe VTS.",
        vessel_message: "Europe VTS, this is MV Sunrise. Over.",
      },
      {
        vts_instruction: "Warn of wrong direction in TSS.",
        vts_message:
          "MV Sunrise, this is Europe VTS. WARNING. You are entering the traffic separation scheme in the wrong way. Over.",
        vessel_instruction: "Request assistance.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. REQUEST. Provide navigational assistance. Over.",
      },
      {
        vts_instruction: "Advise alter course to NW.",
        vts_message:
          "MV Sunrise, this is Europe VTS. ADVICE. Alter course to northwest. Over.",
        vessel_instruction: "Acknowledge and close.",
        vessel_message: "Europe VTS, this is MV Sunrise. RECEIVED. Out.",
      },
    ],
  },
  {
    id: "38",
    name: "Approaching harbour with reduced visibility",
    starter: "vts",
    turns: [
      {
        vts_instruction: "Call MV Sunrise.",
        vts_message: "MV Sunrise, MV Sunrise. This is Europe VTS. Over.",
        vessel_instruction: "Answer Europe VTS.",
        vessel_message: "Europe VTS, this is MV Sunrise. Over.",
      },
      {
        vts_instruction:
          "Inform of traffic: Moonshine inbound; Summer Breeze departs 23:15.",
        vts_message:
          "MV Sunrise, this is Europe VTS. INFORMATION. Moonshine inbound. Summer Breeze departs at two three one five local time. Over.",
        vessel_instruction: "Acknowledge traffic information.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. RECEIVED. Traffic information received. Over.",
      },
      {
        vts_instruction: "Warn of low visibility and advise caution.",
        vts_message:
          "MV Sunrise, this is Europe VTS. WARNING. Reduced visibility. ADVICE. Proceed with caution. Over.",
        vessel_instruction: "Acknowledge and close.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. RECEIVED. Proceeding with caution. Out.",
      },
    ],
  },
  {
    id: "39",
    name: "Vessel not under command",
    starter: "vts",
    turns: [
      {
        vts_instruction: "Call MV Sunrise.",
        vts_message: "MV Sunrise, MV Sunrise. This is Europe VTS. Over.",
        vessel_instruction: "Answer Europe VTS.",
        vessel_message: "Europe VTS, this is MV Sunrise. Over.",
      },
      {
        vts_instruction: "State AIS shows NUC and ask if there's a problem.",
        vts_message:
          "MV Sunrise, this is Europe VTS. WARNING. Your status is set on NUC. QUESTION. Do you have a problem on board? Over.",
        vessel_instruction: "Explain engine maintenance.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. ANSWER. Maintenance on engine. Over.",
      },
      {
        vts_instruction: "Ask if finished in 1h.",
        vts_message:
          "MV Sunrise, this is Europe VTS. QUESTION. Will you solve problem in one hour? Over.",
        vessel_instruction: "Confirm and close.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. ANSWER. Yes, complete in one hour. Out.",
      },
    ],
  },
  {
    id: "40",
    name: "Drifting into territorial waters",
    starter: "vts",
    turns: [
      {
        vts_instruction: "Call MV Sunrise.",
        vts_message: "MV Sunrise, MV Sunrise. This is Europe VTS. Over.",
        vessel_instruction: "Answer call.",
        vessel_message: "Europe VTS, this is MV Sunrise. Over.",
      },
      {
        vts_instruction: "Ask when they plan to resume voyage.",
        vts_message:
          "MV Sunrise, this is Europe VTS. QUESTION. When will you proceed with your voyage? Over.",
        vessel_instruction: "State must check with Master.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. ANSWER. I must confirm with Master. Over.",
      },
      {
        vts_instruction: "Warn of territorial waters and instruct sail south.",
        vts_message:
          "MV Sunrise, this is Europe VTS. WARNING. You drifted into territorial waters. INSTRUCTION. Proceed south. Over.",
        vessel_instruction: "Acknowledge and close.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. RECEIVED. Proceeding south. Out.",
      },
    ],
  },
  {
    id: "41",
    name: "Navigation in icy Arctic Navarea with icebreaker assistance",
    starter: "vts",
    turns: [
      {
        vts_instruction: "Call MV Sunrise.",
        vts_message: "MV Sunrise, MV Sunrise. This is Europe VTS. Over.",
        vessel_instruction: "Answer Europe VTS.",
        vessel_message: "Europe VTS, this is MV Sunrise. Over.",
      },
      {
        vts_instruction: "Inform of sea-ice area and ask for ice class.",
        vts_message:
          "MV Sunrise, this is Europe VTS. INFORMATION. Entering Arctic NAVAREA nineteen. QUESTION. What is your ice class? Over.",
        vessel_instruction: "State Category C.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. ANSWER. Category Charlie ship. Over.",
      },
      {
        vts_instruction: "Ask if have ice forecast and close after info.",
        vts_message:
          "MV Sunrise, this is Europe VTS. QUESTION. Have you RECEIVED ice forecast? INFORMATION. Icebreaker available. Over.",
        vessel_instruction: "Confirm receipt and close.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. ANSWER. Yes. RECEIVED. Out.",
      },
    ],
  },
  {
    id: "42",
    name: "Operating with an icebreaker while in transit through the ice",
    starter: "vts",
    turns: [
      {
        vts_instruction: "Call MV Sunrise.",
        vts_message: "MV Sunrise, MV Sunrise. This is Europe VTS. Over.",
        vessel_instruction: "Answer call.",
        vessel_message: "Europe VTS, this is MV Sunrise. Over.",
      },
      {
        vts_instruction:
          "Announce ops start and instruct follow-up at moderate speed.",
        vts_message:
          "MV Sunrise, this is Europe VTS. INFORMATION. Icebreaker ops start now. INSTRUCTION. Follow icebreaker. Proceed at moderate speed. Over.",
        vessel_instruction: "Acknowledge and close.",
        vessel_message: "Europe VTS, this is MV Sunrise. RECEIVED. Out.",
      },
    ],
  },
  {
    id: "43",
    name: "Improper securing of deck timber deck cargo",
    starter: "vessel",
    turns: [
      {
        vessel_instruction: "Call Europe VTS.",
        vessel_message: "Europe VTS, Europe VTS. This is MV Sunrise. Over.",
        vts_instruction: "Answer MV Sunrise.",
        vts_message: "MV Sunrise, this is Europe VTS. Over.",
      },
      {
        vessel_instruction: "Report lost timber cargo at 60N 26E.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. INFORMATION. Lost timber cargo in position six zero North, two six East. Over.",
        vts_instruction: "Ask if logs are loose or packaged.",
        vts_message:
          "MV Sunrise, this is Europe VTS. QUESTION. Are logs loose or packaged? Over.",
      },
      {
        vessel_instruction: "State logs are loose.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. ANSWER. Logs are in loose form. Over.",
        vts_instruction: "Ask if ship is stable.",
        vts_message:
          "MV Sunrise, this is Europe VTS. QUESTION. Are you able to maintain stability? Over.",
      },
      {
        vessel_instruction:
          "Confirm stability and state no ropes needed, then close.",
        vessel_message:
          "Europe VTS, this is MV Sunrise. ANSWER. Yes, stability maintained. No steel ropes required. Out.",
      },
    ],
  },
  */,
];
