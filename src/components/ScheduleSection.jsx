import React, { useState, startTransition } from 'react';
import { Calendar, Clock, MapPin, Globe, Sparkles, BookOpen, Utensils, Users, Award, ShieldCheck, CheckCircle2, ChevronRight, Music, HeartHandshake, Camera } from 'lucide-react';

export default function ScheduleSection() {
  const [selectedDay, setSelectedDay] = useState(0);
  const [timezone, setTimezone] = useState('WAT');

  const handleSelectDay = (idx) => {
    if (idx === selectedDay) return;
    setTimeout(() => {
      startTransition(() => {
        setSelectedDay(idx);
      });
    }, 0);
  };

  const handleSelectTimezone = (tz) => {
    if (tz === timezone) return;
    setTimeout(() => {
      startTransition(() => {
        setTimezone(tz);
      });
    }, 0);
  };

  const tzOffsets = {
    WAT: 'Local (Port Harcourt • UTC+1)',
    GMT: 'UK (London • UTC+0)',
    EST: 'US/Canada (EST • UTC-5)',
    CST: 'US Central (CST • UTC-6)'
  };

  // Dynamic time conversion for diaspora viewers
  const convertTime = (timeStr, tz) => {
    if (tz === 'WAT') return timeStr;
    const offsetHours = tz === 'GMT' ? -1 : tz === 'EST' ? -6 : tz === 'CST' ? -7 : 0;
    
    return timeStr.replace(/(\d{1,2}):(\d{2})\s*(AM|PM)/gi, (match, h, m, meridiem) => {
      let hour = parseInt(h, 10);
      if (meridiem.toUpperCase() === 'PM' && hour !== 12) hour += 12;
      if (meridiem.toUpperCase() === 'AM' && hour === 12) hour = 0;
      
      let convertedHour = (hour + offsetHours) % 24;
      if (convertedHour < 0) convertedHour += 24;
      
      const newMeridiem = convertedHour >= 12 ? 'PM' : 'AM';
      let displayHour = convertedHour % 12;
      if (displayHour === 0) displayHour = 12;
      return `${displayHour}:${m} ${newMeridiem}`;
    });
  };

  // Official Program Outline from Central Planning Committee (CPC)
  const schedule = [
    {
      day: 'Friday',
      date: 'Nov 20, 2026',
      badge: 'Day 1: Community Service & Arrival',
      title: 'Community Service, Arrival & Registration',
      theme: 'Service, Consecration & Sabbath Preparation',
      events: [
        {
          time: 'Morning',
          title: 'Community Service Outreach',
          venue: 'Host Community / Campus Environs',
          description: 'Confirmed Friday activity. Exact location, outreach activity, and approval finalized by the planning team.',
          tag: 'Outreach'
        },
        {
          time: '10:00 AM – 6:00 PM',
          title: 'Registration & Alumni Accreditation',
          venue: 'RSU Chapel Pavilion & Welcome Desk',
          description: 'Online registration remains the primary registration channel. Physical registration/accreditation desk available for alumni and guests arriving from the morning; delegate packs distributed.',
          tag: 'Accreditation'
        },
        {
          time: '6:00 PM',
          title: 'Transition / Personal Time',
          venue: 'Delegate Lodgings & Campus Quarters',
          description: 'Participants prepare for Sabbath. No Friday dinner programme.',
          tag: 'Transition'
        },
        {
          time: 'Evening',
          title: 'Personal / Sabbath Preparation',
          venue: 'Personal Lodgings & Chapter Quarters',
          description: 'Friday evening is kept light in line with the proposed adjustment. Any required worship/vespers arrangements should be handled separately by the appropriate team.',
          tag: 'Preparation'
        }
      ]
    },
    {
      day: 'Sabbath Morning',
      date: 'Nov 21, 2026',
      badge: 'Day 2: Grand Jubilee Day',
      title: 'Main Anniversary Celebration & Divine Service',
      theme: '“Rooted To Rise: Honoring Our Heritage, Igniting Our Future” (Isaiah 61:3)',
      events: [
        {
          time: '8:00 AM',
          title: 'Sabbath School',
          venue: 'Main Sanctuary & Amphitheatre',
          description: 'Opening hymn, prayer, mission spotlight and interactive lesson, with participation from current students and alumni.',
          tag: 'Worship'
        },
        {
          time: '9:25 AM',
          title: '45th Anniversary Heritage & History Feature',
          venue: 'Main Sanctuary',
          description: 'Merged 20-minute heritage segment combining the Heritage Feature and Brief History of ASF-RSU (1981–2026): heritage documentary + one speaker/narrator.',
          tag: 'Heritage'
        },
        {
          time: '9:45 AM',
          title: 'Grand Opening Procession',
          venue: 'Processional Aisle',
          description: 'Processional entry of past and present ASF executive leaders, officiating ministers and pioneer sets.',
          tag: 'Procession'
        },
        {
          time: '9:55 AM',
          title: 'Opening Prayer & Invocation',
          venue: 'Main Pulpit',
          description: 'Prayer of consecration for the anniversary celebration.',
          tag: 'Invocation'
        },
        {
          time: '10:00 AM',
          title: 'Welcome Address',
          venue: 'Main Pulpit',
          description: 'Opening remarks by the Central Planning Committee (CPC) Chair and ASF Chapter President.',
          tag: 'Address'
        },
        {
          time: '10:10 AM',
          title: 'Anniversary Theme Song',
          venue: 'Sanctuary Platform',
          description: 'Integrated musical feature immediately following the Welcome Address.',
          tag: 'Music'
        },
        {
          time: '10:20 AM',
          title: 'Alumni & Student Testimonies',
          venue: 'Main Pulpit',
          description: 'Selected testimonies celebrating God’s leading in the lives of alumni and students. Strict limit: 15 minutes maximum (3 people × 5 minutes).',
          tag: 'Testimonies'
        },
        {
          time: '10:35 AM',
          title: 'Special Recognition & Honors',
          venue: 'Main Stage',
          description: 'Recognition of founding pioneers, alumni patrons and outstanding leaders. Strict limit: 20 minutes.',
          tag: 'Honors'
        },
        {
          time: '10:55 AM',
          title: 'Anniversary Keynote / Exhortation',
          venue: 'Main Pulpit',
          description: 'Main anniversary address by the Guest Speaker/Minister. Timekeeper to enforce the approved time limit.',
          tag: 'Keynote'
        },
        {
          time: '11:25 AM',
          title: 'Mass Choir Ministration',
          venue: 'Mass Choir Gallery',
          description: 'Integrated musical feature before the thanksgiving and dedication segment.',
          tag: 'Choir'
        },
        {
          time: '11:35 AM',
          title: 'Grand Celebratory Thanksgiving & Dedication Offerings',
          venue: 'Main Sanctuary',
          description: 'Corporate praise, thanksgiving and dedication offerings, with designated musical support.',
          tag: 'Thanksgiving'
        },
        {
          time: '12:05 PM',
          title: 'Cake Cutting Ceremony',
          venue: 'Ceremonial Altar',
          description: 'Ceremonial cutting of the 45th Anniversary cake with pioneer leaders, executive committee and invited dignitaries.',
          tag: 'Celebration'
        },
        {
          time: '12:15 PM',
          title: '45th Anniversary Official Photo Session',
          venue: 'Main Altar & Amphitheatre Grounds',
          description: 'Official group photographs immediately after cake cutting with pioneers, alumni, executives, dignitaries and the congregation as appropriate.',
          tag: 'Photo Session'
        },
        {
          time: '12:25 PM',
          title: 'Magazine / Compendium Reveal',
          venue: 'Main Stage',
          description: 'Official reveal/launch of the anniversary magazine/compendium. Assigned team to coordinate content, presentation and launch.',
          tag: 'Compendium'
        },
        {
          time: '12:35 PM',
          title: 'Closing Prayer & Transition to Lunch',
          venue: 'Main Sanctuary',
          description: 'Prayer and orderly transition into Sabbath Lunch.',
          tag: 'Transition'
        }
      ]
    },
    {
      day: 'Sabbath Afternoon',
      date: 'Nov 21, 2026',
      badge: 'Day 2: Fellowship & Legacy',
      title: 'Fellowship, Legacy & Alumni Integration',
      theme: 'Shared Feast, Intergenerational Mentorship & Closing Reflections',
      events: [
        {
          time: '1:00 PM',
          title: 'Sabbath Lunch',
          venue: 'Campus Hospitality Grounds',
          description: 'Shared anniversary lunch and fellowship.',
          tag: 'Hospitality'
        },
        {
          time: '2:00 PM',
          title: 'Networking Break & Rest',
          venue: 'Fellowship Quadrangle & Lounges',
          description: 'Dedicated time for informal networking, reunions and rest.',
          tag: 'Networking'
        },
        {
          time: '3:00 PM',
          title: 'Compendium & Legacy Programme',
          venue: 'University Auditorium',
          description: 'Compendium/legacy presentation and related launch activities, if additional presentation is required after the official reveal. Responsibilities to be assigned.',
          tag: 'Legacy'
        },
        {
          time: '4:00 PM',
          title: 'Intergenerational Alumni–Student Mentorship & Legacy Chat',
          venue: 'University Auditorium',
          description: 'Interactive conversation connecting alumni veterans with current students on career, faith, leadership and campus legacy.',
          tag: 'Mentorship'
        },
        {
          time: '5:00 PM',
          title: 'Musical Interlude',
          venue: 'Auditorium Platform',
          description: 'Selected musical feature / special performance serving as transition into the closing segment.',
          tag: 'Music'
        },
        {
          time: '5:15 PM',
          title: 'Closing Vespers / Sabbath Evening Reflections',
          venue: 'Main Sanctuary',
          description: 'Reflection, thanksgiving and closing words as the anniversary Sabbath draws to a close.',
          tag: 'Closing'
        }
      ]
    },
    {
      day: 'Saturday Night',
      date: 'Nov 21, 2026',
      badge: 'Day 2: Grand Gala Dinner',
      title: 'Alumni Fellowship Dinner & Integration',
      theme: 'Alumni Integration, Networking & Milestone Celebrations',
      events: [
        {
          time: '7:30 PM',
          title: 'Alumni Fellowship Dinner & Integration',
          venue: 'Selected Hotel / Grand Banquet Venue',
          description: 'Relocation of the dinner/Power Breakfast concept to Saturday night, preferably at a suitable hotel/venue. Includes fellowship, alumni integration, networking and relevant anniversary moments.',
          tag: 'Gala Dinner'
        }
      ]
    }
  ];

  return (
    <section id="program" className="py-16 sm:py-24 px-3 sm:px-6 lg:px-8 bg-stone-100/70 text-[#141E18] border-t border-stone-200/80">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-5 sm:gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-900/10 text-emerald-950 text-xs font-bold uppercase tracking-widest mb-3 border border-emerald-900/15">
              <Calendar className="w-3.5 h-3.5 text-emerald-800" />
              <span>Official Jubilee Horizon</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-retro font-bold text-emerald-950 tracking-tight">
              Celebration Program Outline
            </h2>
            <p className="text-stone-600 text-xs sm:text-base mt-2 font-light max-w-2xl">
              November 20th – 22nd, 2026 • Rivers State University, Port Harcourt. Theme: <em>“Rooted To Rise: Honoring Our Heritage, Igniting Our Future”</em>
            </p>
          </div>

          {/* Timezone Switcher */}
          <div className="bg-white px-3 sm:px-3.5 py-2 rounded-2xl border border-stone-200/90 shadow-sm flex items-center space-x-2 self-start md:self-auto overflow-x-auto max-w-full">
            <Globe className="w-4 h-4 text-emerald-800 shrink-0" />
            <div className="flex space-x-1 text-xs">
              {Object.keys(tzOffsets).map((tz) => (
                <button
                  type="button"
                  key={tz}
                  onClick={() => handleSelectTimezone(tz)}
                  className={`px-2 sm:px-2.5 py-1 rounded-lg font-semibold transition-all touch-manipulation ${
                    timezone === tz
                      ? 'bg-emerald-950 text-white shadow-sm'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <span className="pointer-events-none">{tz}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Day Navigation Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 xs:gap-2.5 sm:gap-3 mb-6 sm:mb-8">
          {schedule.map((item, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => handleSelectDay(idx)}
              className={`p-3 xs:p-3.5 sm:p-4 rounded-xl sm:rounded-2xl text-left transition-all duration-300 border touch-manipulation ${
                selectedDay === idx
                  ? 'bg-emerald-950 text-white border-jubilee-gold/50 shadow-luxury scale-[1.02]'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-emerald-800/40 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] xs:text-[10px] sm:text-[11px] font-sans uppercase tracking-wider font-semibold opacity-75 truncate">
                  {item.date}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  selectedDay === idx ? 'bg-jubilee-gold/20 text-jubilee-lightgold border border-jubilee-gold/40' : 'bg-stone-100 text-stone-600'
                }`}>
                  {idx === 0 ? 'Day 1' : idx === 3 ? 'Gala' : 'Day 2'}
                </span>
              </div>
              <span className="pointer-events-none block text-xs xs:text-sm sm:text-base font-retro font-bold leading-snug truncate">
                {item.day}
              </span>
            </button>
          ))}
        </div>

        {/* Selected Day Program Detail */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 xs:p-5 sm:p-10 border border-stone-200/90 shadow-luxury">
          <div className="border-b border-stone-100 pb-5 mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-900/10 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2">
                {schedule[selectedDay].badge} • {schedule[selectedDay].date} ({tzOffsets[timezone]})
              </span>
              <h3 className="text-xl sm:text-3xl font-retro font-bold text-emerald-950">
                {schedule[selectedDay].title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 font-editorial italic mt-0.5">
                Theme: {schedule[selectedDay].theme}
              </p>
            </div>
            
            <a
              href="#census-rsvp"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-full text-xs font-bold bg-emerald-950 text-white hover:bg-emerald-900 transition-all shadow-sm shrink-0 touch-manipulation"
            >
              <span>RSVP For This Day</span>
            </a>
          </div>

          {/* Events List */}
          <div className="space-y-3.5 sm:space-y-4">
            {schedule[selectedDay].events.map((event, idx) => (
              <div
                key={idx}
                className="group flex flex-col sm:flex-row sm:items-start p-4 sm:p-5 rounded-2xl bg-stone-50/70 border border-stone-100 hover:border-emerald-800/20 hover:bg-white transition-all duration-300 gap-3.5 sm:gap-4"
              >
                {/* Time & Venue Column */}
                <div className="sm:w-60 shrink-0">
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-950 text-jubilee-gold text-xs font-mono font-bold">
                    <Clock className="w-3.5 h-3.5 text-jubilee-gold shrink-0" />
                    <span>{convertTime(event.time, timezone)}</span>
                  </div>
                  {timezone !== 'WAT' && (
                    <div className="text-[10px] text-stone-400 font-mono mt-1">
                      (WAT: {event.time})
                    </div>
                  )}
                  <div className="flex items-center space-x-1.5 text-xs text-stone-500 font-medium mt-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                    <span className="truncate">{event.venue}</span>
                  </div>
                </div>

                {/* Event Details */}
                <div className="grow">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-base sm:text-lg font-retro font-bold text-emerald-950 group-hover:text-emerald-800 transition-colors">
                      {event.title}
                    </h4>
                    {event.tag && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-100/60 text-emerald-900">
                        {event.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-stone-600 mt-1.5 font-light leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Official Implementation & Working Notes Banner */}
        <div className="mt-8 sm:mt-12 rounded-3xl p-5 sm:p-8 bg-gradient-to-br from-[#051A0F] via-[#092B19] to-[#0D3821] text-white border-2 border-jubilee-gold/40 shadow-luxury space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-jubilee-gold/15 text-jubilee-lightgold border border-jubilee-gold/30">
                <ShieldCheck className="w-5 h-5 text-jubilee-gold" />
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-retro font-bold text-white">
                  Implementation Notes &amp; Protocol Guidelines
                </h4>
                <p className="text-xs text-stone-300">
                  Official directive from the 45th Anniversary Central Planning Committee (CPC)
                </p>
              </div>
            </div>

            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 text-jubilee-lightgold text-xs font-mono font-bold">
              <span>Full CPC &amp; Congregation Edition</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-stone-200">
            <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-white/[0.04] border border-white/5">
              <CheckCircle2 className="w-4 h-4 text-jubilee-gold shrink-0 mt-0.5" />
              <span><strong>Master of Ceremonies:</strong> 2 MCs assigned for Sabbath morning; 1 MC for the Saturday-night dinner.</span>
            </div>

            <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-white/[0.04] border border-white/5">
              <CheckCircle2 className="w-4 h-4 text-jubilee-gold shrink-0 mt-0.5" />
              <span><strong>Strict Timekeeping:</strong> Dedicated Timekeeper appointed to enforce approved time limits across all items.</span>
            </div>

            <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-white/[0.04] border border-white/5">
              <CheckCircle2 className="w-4 h-4 text-jubilee-gold shrink-0 mt-0.5" />
              <span><strong>Operational Units:</strong> Assigned teams for Protocol, Ushers, Security, Medical/First Aid, Power, and Media.</span>
            </div>

            <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-white/[0.04] border border-white/5">
              <CheckCircle2 className="w-4 h-4 text-jubilee-gold shrink-0 mt-0.5" />
              <span><strong>Community Service:</strong> Location, approval letter, and community blessing activity finalized by the planning team.</span>
            </div>

            <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-white/[0.04] border border-white/5">
              <CheckCircle2 className="w-4 h-4 text-jubilee-gold shrink-0 mt-0.5" />
              <span><strong>Compendium &amp; Magazine:</strong> Dedicated reveal during morning service and afternoon legacy presentation session.</span>
            </div>

            <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-white/[0.04] border border-white/5">
              <CheckCircle2 className="w-4 h-4 text-jubilee-gold shrink-0 mt-0.5" />
              <span><strong>Saturday Night Dinner:</strong> Dinner/Power Breakfast relocated to Saturday night (7:30 PM) for maximal alumni fellowship.</span>
            </div>
          </div>

          <div className="pt-2 text-center sm:text-left text-[11px] text-stone-400 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>Sunday, Nov 22: Informal Departures, Airport Transfers (PHC Omagwa), and Farewell Inter-Chapter Visits.</span>
            <span className="font-mono text-jubilee-gold">Rooted to Rise • 1981–2026</span>
          </div>
        </div>

      </div>
    </section>
  );
}

