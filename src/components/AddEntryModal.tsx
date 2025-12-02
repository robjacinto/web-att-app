import React from "react";
import { CalendarEntry } from "../types";

interface AddEntryModalProps {
  selectedDate: Date;
  onClose: () => void;
  onSave: (status: string) => void;
  onDelete?: () => void; // optional delete handler
  existingEntry?: CalendarEntry | null;
}

const AddEntryModal: React.FC<AddEntryModalProps> = ({
  selectedDate,
  onClose,
  onSave,
  onDelete,
  existingEntry,
}) => {
  const [status, setStatus] = React.useState(existingEntry?.status || "onsite");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(status);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h3 className="text-lg font-bold mb-4">
          {existingEntry ? "Edit Entry" : "Add Entry"} for {selectedDate.toDateString()}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border p-2 w-full"
            >
              <option value="onsite">Onsite</option>
              <option value="remote">Remote</option>
            </select>
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            {existingEntry && onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AddEntryModal;