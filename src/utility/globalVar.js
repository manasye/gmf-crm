export const perPageOptions = [
  {
    value: "10",
    text: "10"
  },
  {
    value: "20",
    text: "20"
  },
  {
    value: "50",
    text: "50"
  }
];

export const departments = [
  { name: "Base Maintenance", value: "Base Maintenance", text: "Base Maintenance" },
  {
    name: "Outstation Line Maintenance",
    value: "Outstation Line Maintenance",
    text: "Outstation Line Maintenance"
  },
  {
    name: "Logistic & Material Maintenance",
    value: "Logistic & Material Maintenance",
    text: "Logistic & Material Maintenance"
  },
  { name: "Learning / Training", value: "Learning / Training", text: "Learning / Training" },
  { name: "Cabin Maintenance", value: "Cabin Maintenance", text: "Cabin Maintenance" },
  { name: "Engineering Services", value: "Engineering Services", text: "Engineering Services" },
  { name: "Power Service (IGTE)", value: "Power Service (IGTE)", text: "Power Service (IGTE)" },
  { name: "Component Services", value: "Component Services", text: "Component Services" },
  { name: "Line Maintenance", value: "Line Maintenance", text: "Line Maintenance" },
  { name: "Engine Services", value: "Engine Services", text: "Engine Services" },
  { name: "Ground Support", value: "Ground Support", text: "Ground Support" },
  {
    name: "Facility / IT / Other Services",
    value: "Facility / IT / Other Services",
    text: "Facility / IT / Other Services"
  }
];

export const religions = [
  {
    value: null,
    text: "All Religions"
  },
  {
    value: "Christianity",
    text: "Christianity"
  },
  {
    value: "Islam",
    text: "Islam"
  },
  {
    value: "Buddhism",
    text: "Buddhism"
  },
  {
    value: "Hinduism",
    text: "Hinduism"
  },
  {
    value: "Sikhism",
    text: "Sikhism"
  }
];

export const statusProjects = [
  {
    value: null,
    text: "All Status"
  },
  {
    value: "Closed",
    text: "Closed"
  },
  {
    value: "Ongoing",
    text: "Ongoing"
  }
];

export const statusComplaints = [
  {
    value: null,
    text: "All Status"
  },
  {
    value: "Open",
    text: "Open"
  },
  {
    value: "Receive",
    text: "Receive"
  },
  {
    value: "Onprogress",
    text: "Onprogress"
  },
  {
    value: "Closed",
    text: "Closed"
  }
];

export const months = [
  {
    value: null,
    text: "All Months"
  },
  {
    text: "January",
    value: "1"
  },
  {
    text: "February",
    value: "2"
  },
  {
    text: "March",
    value: "3"
  },
  {
    text: "April",
    value: "4"
  },
  {
    text: "May",
    value: "5"
  },
  {
    text: "June",
    value: "6"
  },
  {
    text: "July",
    value: "7"
  },
  {
    text: "August",
    value: "8"
  },
  {
    text: "September",
    value: "9"
  },
  {
    text: "October",
    value: "10"
  },
  {
    text: "November",
    value: "11"
  },
  {
    text: "December",
    value: "12"
  }
];

export const ratingOptions = [
  {
    value: null,
    text: "All Ratings"
  },
  {
    text: "1",
    value: "1"
  },
  {
    text: "2",
    value: "2"
  },
  {
    text: "3",
    value: "3"
  },
  {
    text: "4",
    value: "4"
  },
  {
    text: "5",
    value: "5"
  }
];

export const rangeOptions = [
  {
    value: null,
    text: "All Range"
  },
  {
    value: 1,
    text: "This Month"
  },
  {
    value: 3,
    text: "Last 3 Month"
  },
  {
    value: 6,
    text: "Last 6 Month"
  },
  {
    value: 12,
    text: "This Year"
  }
];

export const trendOption = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    animateRotate: false
  },
  legend: {
    align: "center"
  },
  scales: {
    yAxes: [
      {
        ticks: {
          min: 0,
          stepSize: 1
        }
      }
    ]
  }
};
