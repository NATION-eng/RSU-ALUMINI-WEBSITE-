import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Globe, Sparkles, Music, Users, Award, Download } from 'lucide-react';

export default function ScheduleSection() {
  const [selectedDay, setSelectedDay] = useState(0);
  const [timezone, setTimezone] = useState('WAT');

  const tzOffsets = {
    WAT: '+0 hrs (Port Harcourt)',
    GMT: '-1 hr (London/Accra)',
    EST: '-5 hrs (New York/Toronto)',
    CST: '-6 hrs (Chicago/Houston)'
  };

  const schedule = [
    {
      day: 'Day 1: Friday Sunset',
      title: 'The Gathering of the Tribe & Revival Vespers',
      date: 'November 13, 2026',
      theme: 'Consecration & Heritage Remembrance',
      events: [
        {
          time: '3:00 PM – 5:30 PM',
          title: 'Delegate Arrival & Homecoming Accreditation',
          venue: 'RSU Chapel Foyer / Accreditation Pavilion',
          description: 'Arrival of pioneer sets, diaspora delegates, and alumni. Collection of homecoming packs and registration tags.'
        },
        {
          time: '6:00 PM – 8:30 PM',
          title: 'Opening Jubilee Vespers: "Rooted in Faith"',
          venue: 'Main Sanctuary, RSU Chapel Grounds',
          description: 'Sunset hymn singing, opening address by Chapter Pioneer Elders, and keynote revival sermon.'
        },
        {
          time: '8:30 PM – 9:30 PM',
          title: 'Welcome Reception & Diaspora Meet-and-Greet',
          venue: 'Sanctuary Quadrangle',
          description: 'Light refreshments, decade group reunions, and intergenerational networking.'
        }
      ]
    },
    {
      day: 'Day 2: Sabbath Morning',
      title: '45th Grand Jubilee Divine Worship & Roll Call',
      date: 'November 14, 2026',
      theme: 'Praise, Thanksgiving & Divine Commissioning',
      events: [
        {
          time: '8:30 AM – 10:00 AM',
          title: 'Sabbath School: "Four Decades of Spiritual Growth"',
          venue: 'Main Sanctuary & Virtual Livestream',
          description: 'Interactive panel review featuring pioneer class leaders and contemporary student teachers.'
        },
        {
          time: '10:15 AM – 1:00 PM',
          title: '45th Jubilee Divine Service & Processional Roll Call of Sets',
          venue: 'RSU Amphitheatre / Chapel Auditorium',
          description: 'Processional parade of 1981–2026 graduating sets, university leadership address, and grand jubilee thanksgiving sermon.'
        },
        {
          time: '1:30 PM – 3:00 PM',
          title: 'Grand Fellowship Love Feast & Fellowship Lunch',
          venue: 'RSU Campus Hospitality Pavilion',
          description: 'Buffet lunch, set photographs, and red-carpet alumni video interviews.'
        }
      ]
    },
    {
      day: 'Day 2: Sabbath Afternoon',
      title: 'Sacred Music Concert & Mass Choir Cantata',
      date: 'November 14, 2026',
      theme: 'Harmony of the Ages (45 Voices United)',
      events: [
        {
          time: '4:00 PM – 6:30 PM',
          title: '45th Anniversary Sacred Music Concert',
          venue: 'RSU Amphitheatre',
          description: 'Combined Mass Choir spanning 4 decades of choir alumni, classical anthems, instrumental performances, and hymnody.'
        },
        {
          time: '6:30 PM – 7:30 PM',
          title: 'Vesper Closing & Red-Carpet Night of Memories',
          venue: 'Chapel Grounds',
          description: 'Sabbath closing prayers, candle-lighting ceremony symbolizing passing the torch to undergraduates.'
        }
      ]
    },
    {
      day: 'Day 3: Sunday Morning',
      title: 'Alumni Thanksgiving Banquet & Compendium Launch',
      date: 'November 15, 2026',
      theme: 'Igniting the Future & Legacy Projects',
      events: [
        {
          time: '9:30 AM – 11:30 AM',
          title: 'Alumni Breakfast & Legacy Project Unveiling',
          venue: 'University Event Centre, RSU Port Harcourt',
          description: 'Presentation of the 45th Anniversary student scholarship fund and campus infrastructure legacy contribution.'
        },
        {
          time: '11:30 AM – 1:30 PM',
          title: 'Official Launch of the 45th Jubilee Alumni Magazine',
          venue: 'University Event Centre',
          description: 'Unveiling and distribution of the landmark commemorative compendium (1981–2026) and award recognitions.'
        }
      ]
    }
  ];

  return (
    <section id="program" className="py-24 px-4 sm:px-6 lg:px-8 bg-stone-100 text-stone-900 border-t border-stone-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-800 text-jubilee-lightgold text-xs font-bold uppercase tracking-wider mb-3">
              <Calendar className="w-3.5 h-3.5 text-jubilee-gold" />
              <span>Official Event Horizon</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-emerald-950 tracking-tight">
              45th Jubilee Program Schedule
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-xl">
              Three glorious days of fellowship, sacred music, nostalgia, and future planning at Rivers State University (November 13th – 15th, 2026).
            </p>
          </div>

          {/* Timezone Switcher */}
          <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-sm flex items-center space-x-3">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-stone-600">
              <Globe className="w-4 h-4 text-emerald-800" />
              <span>Timezone:</span>
            </div>
            <div className="flex space-x-1">
              {Object.keys(tzOffsets).map((tz) => (
                <button
                  key={tz}
                  onClick={() => setTimezone(tz)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                    timezone === tz
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : 'bg-stone-50 text-stone-600 hover:bg-stone-200'
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
              className={`p-4 rounded-2xl text-left transition-all border ${
                selectedDay === idx
                  ? 'bg-emerald-900 text-white border-emerald-900 shadow-lg shadow-emerald-900/15'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-emerald-700'
              }`}
            >
              <div className="text-[11px] uppercase tracking-wider font-bold opacity-80">
                {item.date}
              </div>
              <div className="text-sm sm:text-base font-serif font-bold mt-1 leading-snug">
                {item.day}
              </div>
            </button>
          ))}
        </div>

        {/* Selected Day Program Detail */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-md">
          <div className="border-b border-stone-100 pb-6 mb-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <div className="text-xs uppercase font-bold tracking-widest text-emerald-800 mb-1">
                {schedule[selectedDay].day} • {schedule[selectedDay].date} ({tzOffsets[timezone]})
              </div>
              <h3 className="text-2xl font-serif font-bold text-stone-900">
                {schedule[selectedDay].title}
              </h3>
              <p className="text-xs text-stone-500 font-medium italic mt-1">
                Theme: {schedule[selectedDay].theme}
              </p>
            </div>
            
            <a
              href="#census-rsvp"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>RSVP For This Session</span>
            </a>
          </div>

          {/* Events List */}
          <div className="space-y-6">
            {schedule[selectedDay].events.map((event, idx) => (
              <div key={idx} className="flex flex-col md:flex-row md:items-start p-5 rounded-2xl bg-stone-50/80 border border-stone-100 hover:border-emerald-200 transition-colors gap-4">
                
                {/* Time column */}
                <div className="md:w-56 shrink-0">
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-900 text-xs font-mono font-bold">
                    <Clock className="w-3.5 h-3.5 text-emerald-800" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-stone-500 font-medium mt-2">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate">{event.venue}</span>
                  </div>
                </div>

                {/* Event Details */}
                <div className="grow">
                  <h4 className="text-base font-bold text-emerald-950 font-serif">
                    {event.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
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
