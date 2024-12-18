1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71
72
73
74
75
76
77
78
79
80
81
82
83
84
85
86
87
88
89
90
91
92
93
94
95
96
97
98
99
100
101
102
103
104
105
106
107
108
109
110
111
112
113
114
115
116
117
118
119
120
121
122
123
124
125
126
127
128
129
130
131
132
133
134
135
136
137
138
139
140
141
142
143
144
145
146
147
148
149
150
151
152
153
154
155
156
157
158
159
160
161
// Home.js
import React from 'react';
import weblogo from '../../assets/website/weblogo.png';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 

const Home = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/v1/events');
        setEvents(response.data.data.slice(0, 3)); // Get only the first 3 events
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleEventClick = (eventId) => {
    navigate(`/eventsdetails/${eventId}`);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Hero Section */}
      <section className="bg-black text-white py-16 px-8">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left md:w-1/2">
            <h1 className="text-5xl font-bold mb-4">
              Uncovering Insights from <span className="text-yellow-500">TUPT Programs</span>
            </h1>
            <p className="mb-6">
              A comprehensive look at how sentiment analysis can illuminate the opinions and feedback of members regarding organizational programs at the Technological University of the Philippines – Taguig.
            </p>
            <button className="bg-yellow-500 text-black py-2 px-4 rounded-lg mb-4 md:mb-0">Learn More</button>
            <div className="flex justify-center md:justify-start gap-4 mt-4">
              <a href="#" className="text-white">Read Our Study</a>
              <a href="#" className="text-white">Contact Us</a>
            </div>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0">
            <div className="relative">
              <img src={weblogo} alt="Analysis and Research" className="rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Latest Events Section */}
      <section className="py-16 px-8 bg-gray-200 dark:bg-gray-800">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-8">Recent Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard 
                key={event._id} 
                event={event} 
                onClick={() => handleEventClick(event._id)} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-8 px-4">
        <div className="container mx-auto text-center">
          <p>© 2024 Technological University of the Philippines – Taguig. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const EventCard = ({ event, onClick }) => {
  const imageUrl = event.images?.[0]?.url || event.images?.[0] || "https://via.placeholder.com/150";

  return (
    <div 
      className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md cursor-pointer"
      onClick={onClick}
    >
      <img 
        src={imageUrl}
        alt={event.name}
        className="w-full h-48 object-cover rounded-lg mb-4"
        onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
      />
      <h3 className="text-2xl font-semibold">{event.name}</h3>
      <p className="mt-2">{event.description}</p>
    </div>
  );
};

export default Home;