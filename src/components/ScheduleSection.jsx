import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Globe, Sparkles } from 'lucide-react';

export default function ScheduleSection() {
  const [selectedDay, setSelectedDay] = useState(0);
  const [timezone, setTimezone] = useState('WAT');

  const tzOffsets = {
    WAT: 'Local (Port Harcourt)',
    GMT: 'UK (London)',
    EST: 'US/Canada (EST)',
    CST: 'US Central (CST)'
  };

  const schedule = [
    {
      day: 'Friday',
      date: 'Nov 13, 2026',
      badge: 'Day 1: Sunset Welcome',
      title: 'The Gathering & Revival Vespers',
      theme: 'Consecration & Heritage Remembrance',
      events: [
        {
          time: '3:00 PM – 5:30 PM',
          title: 'Delegate Accreditation & Welcome Reception',
          venue: 'RSU Chapel Pavilion',
          description: 'Arrival of pioneer sets, diaspora delegates, collection of 45th Homecoming badges and gift packs.'
        },
        {
          time: '6:00 PM – 8:30 PM',
          title: 'Sunset Revival Vespers: "Rooted in Faith"',
          venue: 'Main Sanctuary',
          description: 'Sunset hymn sing-along, address by pioneer chapter elders, and keynote consecration service.'
        },
        {
          time: '8:30 PM – 9:30 PM',
          title: 'Alumni Decade Reunions & Hospitality Meet',
          venue: 'Sanctuary Quadrangle',
          description: 'Intergenerational networking, light refreshments, and set fellowship photo sessions.'
        }
      ]
    },
    {
      day: 'Sabbath Morning',
      date: 'Nov 14, 2026',
      badge: 'Day 2: Grand Jubilee Day',
      title: 'Grand Jubilee Divine Worship & Roll Call',
      theme: 'Praise, Thanksgiving & Divine Commissioning',
      events: [
        {
          time: '8:30 AM – 10:00 AM',
          title: 'Jubilee Sabbath School: "Four Decades of Grace"',
          venue: 'Main Sanctuary & Livestream',
          description: 'Dynamic intergenerational panel lesson study with pioneer and student teachers.'
        },
        {
          time: '10:15 AM – 1:00 PM',
          title: '45th Jubilee Divine Worship & Processional Roll Call',
          venue: 'RSU Amphitheatre',
          description: 'Grand processional of 1981–2026 sets, university leadership goodwill address, and thanksgiving sermon.'
        },
        {
          time: '1:30 PM – 3:00 PM',
          title: 'Fellowship Love Feast & Red-Carpet Interviews',
          venue: 'Campus Hospitality Grounds',
          description: 'Homecoming banquet lunch, official set photographs, and video documentary interviews.'
        }
      ]
    },
    {
      day: 'Sabbath Afternoon',
      date: 'Nov 14, 2026',
      badge: 'Day 2: Sacred Cantata',
      title: 'Sacred Music Concert & Mass Choir Cantata',
      theme: 'Harmony of the Ages (45 Voices United)',
      events: [
        {
          time: '4:00 PM – 6:30 PM',
          title: '45th Anniversary Sacred Music Concert',
          venue: 'RSU Amphitheatre',
          description: 'Combined Mass Choir spanning 4 decades, classical anthems, sacred hymnody, and brass orchestra.'
        },
        {
          time: '6:30 PM – 7:30 PM',
          title: 'Sabbath Closing & Torchlight Ceremony',
          venue: 'Sanctuary Amphitheatre',
          description: 'Candle-lighting dedication passing the spiritual torch to current student leaders.'
        }
      ]
    },
    {
      day: 'Sunday',
      date: 'Nov 15, 2026',
      badge: 'Day 3: Thanksgiving Banquet',
      title: 'Alumni Banquet & Compendium Launch',
      theme: 'Igniting the Future & Legacy Endowment',
      events: [
        {
          time: '9:30 AM – 11:30 AM',
          title: 'Alumni Thanksgiving Breakfast & Legacy Launch',
          venue: 'University Event Centre',
          description: 'Unveiling the 45th Anniversary student scholarship fund and campus legacy contribution.'
        },
        {
          time: '11:30 AM – 1:30 PM',
          title: 'Launch of 45th Jubilee Alumni Magazine',
          venue: 'University Event Centre',
          description: 'Presentation of the commemorative historical compendium (1981–2026) and alumni awards.'
        }
      ]
    }
  ];

  return (
    <section id="program" className="py-24 px-4 sm:px-6 lg:px-8 bg-stone-100/70 text-[#141E18] border-t border-stone-200/80">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-900/10 text-emerald-950 text-xs font-bold uppercase tracking-widest mb-3 border border-emerald-900/15">
              <Calendar className="w-3.5 h-3.5 text-emerald-800" />
              <span>Official Jubilee Horizon</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-retro font-bold text-emerald-950 tracking-tight">
              Celebration Program
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-2 font-light">
              November 13th – 15th, 2026 • Rivers State University, Port Harcourt
            </p>
          </div>

          {/* Timezone Switcher */}
          <div className="bg-white px-3.5 py-2 rounded-2xl border border-stone-200/90 shadow-sm flex items-center space-x-2.5">
            <Globe className="w-4 h-4 text-emerald-800 shrink-0" />
            <div className="flex space-x-1 text-xs">
              {Object.keys(tzOffsets).map((tz) => (
                <button
                  key={tz}
                  onClick={() => setTimezone(tz)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                    timezone === tz
                      ? 'bg-emerald-950 text-white shadow-sm'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {tz}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Day Navigation Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {schedule.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedDay(idx)}
              className={`p-4 rounded-2xl text-left transition-all duration-300 border ${
                selectedDay === idx
                  ? 'bg-emerald-950 text-white border-jubilee-gold/50 shadow-luxury scale-[1.02]'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-emerald-800/40 hover:bg-stone-50'
              }`}
            >
              <span className="block text-[11px] font-sans uppercase tracking-wider font-semibold opacity-75">
                {item.date}
              </span>
              <span className="block text-base sm:text-lg font-retro font-bold mt-0.5 leading-snug">
                {item.day}
              </span>
            </button>
          ))}
        </div>

        {/* Selected Day Program Detail */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-luxury">
          <div className="border-b border-stone-100 pb-5 mb-8 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-900/10 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2">
                {schedule[selectedDay].badge} • {schedule[selectedDay].date} ({tzOffsets[timezone]})
              </span>
              <h3 className="text-2xl sm:text-3xl font-retro font-bold text-emerald-950">
                {schedule[selectedDay].title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 font-editorial italic mt-0.5">
                Theme: {schedule[selectedDay].theme}
              </p>
            </div>
            
            <a
              href="#census-rsvp"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-bold bg-emerald-950 text-white hover:bg-emerald-900 transition-all shadow-sm shrink-0"
            >
              <span>RSVP For This Day</span>
            </a>
          </div>

          {/* Events List */}
          <div className="space-y-4">
            {schedule[selectedDay].events.map((event, idx) => (
              <div
                key={idx}
                className="group flex flex-col sm:flex-row sm:items-start p-4 sm:p-5 rounded-2xl bg-stone-50/70 border border-stone-100 hover:border-emerald-800/20 hover:bg-white transition-all duration-300 gap-4"
              >
                {/* Time & Venue Column */}
                <div className="sm:w-56 shrink-0">
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-950 text-jubilee-gold text-xs font-mono font-bold">
                    <Clock className="w-3.5 h-3.5 text-jubilee-gold" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-stone-500 font-medium mt-2">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{event.venue}</span>
                  </div>
                </div>

                {/* Event Details */}
                <div className="grow">
                  <h4 className="text-base font-retro font-bold text-emerald-950 group-hover:text-emerald-800 transition-colors">
                    {event.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-600 mt-1 font-light leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
