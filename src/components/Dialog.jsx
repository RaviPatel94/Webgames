import { motion } from "framer-motion"

export default function Dialog({ isOpen, onClose, title, data }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 text-lg 2xl:text-xl">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-lightgrey border-2 border-t-gray-100 border-l-gray-100 border-b-gray-600 border-r-gray-600 w-80 max-h-[90vh] shadow-lg flex flex-col"
        style={{ fontFamily: 'MS Sans Serif, sans-serif' }}
      >
        {/* Title Bar */}
        <div className="flex justify-between items-center px-1 py-1 bg-[#000080] border-b border-gray-400 flex-shrink-0">
          {title && (
            <h2 className="text-white  font-bold pl-2 select-none">{title}</h2>
          )}
          <div className="flex gap-0.5">
            {/* Close button */}
            <button
              onClick={onClose}
              className="w-4 h-4 bg-gray-200 border border-t-gray-100 border-l-gray-100 border-b-gray-600 border-r-gray-600 hover:border-t-gray-600 hover:border-l-gray-600 hover:border-b-gray-100 hover:border-r-gray-100 active:border-inset flex items-center justify-center text-xs font-bold transition-all duration-75"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 flex-1 min-h-0 ">
          {(!data || data.length === 0) ? (
            <p className="text-center  text-gray-800">No scores yet!</p>
          ) : (
            <div className=" scorebox  p-2 h-full">
              <div className="space-y-1 overflow-y-auto h-full">
                {data.map((s, i) => (
                  <div key={s.id || i} className="flex justify-between  py-0.5 px-1 hover:bg-[#000080] hover:text-white cursor-default">
                    <span>{i + 1}. {s.username}</span>
                    <span>{s.score.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </motion.div>
    </div>
  )
}