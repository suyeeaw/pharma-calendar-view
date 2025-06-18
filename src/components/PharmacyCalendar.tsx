
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

interface Pharmacist {
  id: string;
  name: string;
  color: string;
  isVisible: boolean;
}

interface Appointment {
  id: string;
  pharmacistId: string;
  title: string;
  startTime: string;
  endTime: string;
  day: string;
}

const PharmacyCalendar = () => {
  const [pharmacists, setPharmacists] = useState<Pharmacist[]>([
    { id: '1', name: 'Steven', color: 'bg-blue-500', isVisible: true },
    { id: '2', name: 'Bob', color: 'bg-pink-500', isVisible: true },
    { id: '3', name: 'John', color: 'bg-green-500', isVisible: true },
    { id: '4', name: 'Mary', color: 'bg-purple-500', isVisible: true },
    { id: '5', name: 'Danielle', color: 'bg-orange-500', isVisible: true },
  ]);

  const [appointments] = useState<Appointment[]>([
    { id: '1', pharmacistId: '1', title: 'Morning Shift', startTime: '08:00', endTime: '12:00', day: 'Monday' },
    { id: '2', pharmacistId: '2', title: 'Afternoon Shift', startTime: '13:00', endTime: '17:00', day: 'Monday' },
    { id: '3', pharmacistId: '3', title: 'Full Day', startTime: '09:00', endTime: '18:00', day: 'Tuesday' },
    { id: '4', pharmacistId: '4', title: 'Evening Shift', startTime: '14:00', endTime: '22:00', day: 'Wednesday' },
    { id: '5', pharmacistId: '1', title: 'Split Shift', startTime: '10:00', endTime: '14:00', day: 'Thursday' },
    { id: '6', pharmacistId: '5', title: 'Weekend Coverage', startTime: '12:00', endTime: '20:00', day: 'Friday' },
    { id: '7', pharmacistId: '2', title: 'Morning Coverage', startTime: '07:00', endTime: '15:00', day: 'Saturday' },
    { id: '8', pharmacistId: '3', title: 'Consultation Hours', startTime: '16:00', endTime: '19:00', day: 'Thursday' },
  ]);

  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

  const togglePharmacist = (id: string) => {
    setPharmacists(prev => 
      prev.map(p => p.id === id ? { ...p, isVisible: !p.isVisible } : p)
    );
  };

  const filteredPharmacists = pharmacists.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getVisibleAppointments = () => {
    const visiblePharmacistIds = pharmacists.filter(p => p.isVisible).map(p => p.id);
    return appointments.filter(apt => visiblePharmacistIds.includes(apt.pharmacistId));
  };

  const getAppointmentStyle = (appointment: Appointment) => {
    const pharmacist = pharmacists.find(p => p.id === appointment.pharmacistId);
    const startHour = parseInt(appointment.startTime.split(':')[0]);
    const endHour = parseInt(appointment.endTime.split(':')[0]);
    const duration = endHour - startHour;
    
    return {
      top: `${(startHour / 24) * 100}%`,
      height: `${(duration / 24) * 100}%`,
      backgroundColor: pharmacist?.color.replace('bg-', '').replace('-500', ''),
    };
  };

  const formatWeekRange = (date: Date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Pharmacy Schedule</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search pharmacists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Pharmacists</h3>
          {filteredPharmacists.map((pharmacist) => (
            <div
              key={pharmacist.id}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => togglePharmacist(pharmacist.id)}
            >
              <Checkbox
                checked={pharmacist.isVisible}
                onChange={() => togglePharmacist(pharmacist.id)}
                className="data-[state=checked]:bg-blue-600"
              />
              <div className={`w-4 h-4 rounded-full ${pharmacist.color}`}></div>
              <span className="text-gray-700 font-medium">{pharmacist.name}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Quick Stats</h4>
          <p className="text-sm text-blue-700">
            {pharmacists.filter(p => p.isVisible).length} of {pharmacists.length} pharmacists visible
          </p>
          <p className="text-sm text-blue-700">
            {getVisibleAppointments().length} appointments this week
          </p>
        </div>
      </div>

      {/* Main Calendar */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-6 h-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Weekly Schedule</h1>
              </div>
              <div className="text-lg font-medium text-gray-600">
                {formatWeekRange(currentWeek)}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newWeek = new Date(currentWeek);
                  newWeek.setDate(currentWeek.getDate() - 7);
                  setCurrentWeek(newWeek);
                }}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentWeek(new Date())}
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newWeek = new Date(currentWeek);
                  newWeek.setDate(currentWeek.getDate() + 7);
                  setCurrentWeek(newWeek);
                }}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 overflow-auto">
          <div className="min-w-full">
            {/* Days Header */}
            <div className="grid grid-cols-8 border-b border-gray-200 bg-white sticky top-0 z-10">
              <div className="p-4 text-center font-medium text-gray-500 border-r border-gray-200">
                Time
              </div>
              {days.map((day) => (
                <div key={day} className="p-4 text-center font-medium text-gray-900 border-r border-gray-200 last:border-r-0">
                  {day}
                </div>
              ))}
            </div>

            {/* Time Grid */}
            <div className="relative">
              {timeSlots.map((time, timeIndex) => (
                <div key={time} className="grid grid-cols-8 border-b border-gray-100">
                  <div className="p-2 text-right text-sm text-gray-500 border-r border-gray-200 bg-gray-50">
                    {time}
                  </div>
                  {days.map((day) => (
                    <div
                      key={`${day}-${time}`}
                      className="relative h-16 border-r border-gray-100 last:border-r-0 hover:bg-blue-50 transition-colors"
                    >
                      {/* Render appointments */}
                      {getVisibleAppointments()
                        .filter(apt => apt.day === day)
                        .map((appointment) => {
                          const startHour = parseInt(appointment.startTime.split(':')[0]);
                          if (startHour === timeIndex) {
                            const pharmacist = pharmacists.find(p => p.id === appointment.pharmacistId);
                            const endHour = parseInt(appointment.endTime.split(':')[0]);
                            const duration = endHour - startHour;
                            
                            return (
                              <div
                                key={appointment.id}
                                className={`absolute left-1 right-1 rounded-md p-2 text-white text-xs font-medium shadow-sm hover:shadow-md transition-shadow cursor-pointer ${pharmacist?.color} opacity-90 hover:opacity-100`}
                                style={{
                                  height: `${duration * 64 - 4}px`,
                                  zIndex: 5,
                                }}
                                title={`${pharmacist?.name}: ${appointment.title} (${appointment.startTime}-${appointment.endTime})`}
                              >
                                <div className="font-semibold">{pharmacist?.name}</div>
                                <div className="text-xs opacity-90">{appointment.title}</div>
                                <div className="text-xs opacity-75">{appointment.startTime}-{appointment.endTime}</div>
                              </div>
                            );
                          }
                          return null;
                        })}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyCalendar;
