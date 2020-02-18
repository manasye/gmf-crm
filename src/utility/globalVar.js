import axios from "axios";
axios.defaults.baseURL = "http://172.16.41.180:8080/api";
axios.defaults.withCredentials = true;

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

export const departments = () => {
  return axios
    .get("/service/read")
    .then(res => {
      let services = [];
      res.data.data.map(s => {
        services.push({ name: s.name, value: s.name, text: s.name });
      });
      return services;
    })
    .catch(() => {
      return [];
    });
};

export const religions = [
  {
    value: null,
    text: "All Religions"
  },
  {
    value: "Islam",
    text: "Islam"
  },
  {
    value: "Christians",
    text: "Christians"
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
  },
  {
    value: "Universal",
    text: "Universal"
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
    value: "On Going",
    text: "On Going"
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
    value: "On Progress",
    text: "On Progress"
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
