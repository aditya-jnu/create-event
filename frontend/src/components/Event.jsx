import React, { useState } from 'react';
import axios from 'axios';

export default function Event() {
  const [event, setEvent] = useState({summary:'',location:'',description:'',startDateTime:'',endDateTime:''})

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent({ ...event, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Format the start and end times to match the required format (ISO 8601)
    const formattedStartDateTime = new Date(event.startDateTime).toISOString();
    const formattedEndDateTime = new Date(event.endDateTime).toISOString();
    try{
          const response = await axios.post('http://localhost:5000/create-event',
          {
            summary: event.summary,
            location: event.location,
            description: event.description,
            startDateTime: formattedStartDateTime,
            endDateTime: formattedEndDateTime, 
          },
          {
            headers: { 'Content-Type': 'application/json'},
            withCredentials: true, // Include cookies for session handling
          }
          );
          alert(`Event created successfully! View it here: ${response.data.eventLink}`);
    } 
    catch(error){
      console.error('Error creating event:', error.response?.data || error.message);
      alert('Failed to create the event. Please try again.');
    }
  };

  return (
    <div className="h-screen p-4 flex justify-center items-center bg-gray-200">
      <div className="rounded-lg p-5 shadow-lg bg-white">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <input type="text" placeholder='summary of the event' name="summary" value={event.summary}
              onChange={handleChange} className="border border-gray-300 p-2 w-full rounded-lg" required
            />
          </div>
          <div>
            <input type="text" placeholder='location of the event' name="location" value={event.location}
              onChange={handleChange} className="border border-gray-300 p-2 w-full rounded-lg"
            />
          </div>
          <div>
            <textarea placeholder='description of the event' name="description" value={event.description}
              onChange={handleChange} className="border border-gray-300 p-2 w-full rounded"
            />
          </div>
          <div>
            <label className="block">
              Start Date & Time:
            <input type="datetime-local" name="startDateTime" value={event.startDateTime}
              onChange={handleChange} className="border border-gray-300 p-2 w-full rounded-lg" required
            />
            </label>
          </div>
          <div>
            <label className="block">
              End Date & Time:
              <input type="datetime-local" name="endDateTime" value={event.endDateTime}
              onChange={handleChange} className="border border-gray-300 p-2 w-full rounded" required
            />
            </label>
          </div>
          <button type="submit"
          className="bg-secondary-blue hover:bg-primary-blue text-white font-bold p-3 w-auto rounded-lg mt-2"
          >Create an event</button>
        </form>
      </div>
    </div>
  );
}
