import { motion } from "framer-motion"

export default function Dialog({ isOpen, onClose, title, children, actions }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      {/* Dialog box */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-gray-900 border-4 border-white text-white p-6 rounded-lg shadow-lg w-96"
      >
        {/* Title */}
        {title && (
          <h2 className="text-2xl font-bold mb-4 text-center">{title}</h2>
        )}

        {/* Content */}
        <div className="mb-6">{children}</div>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          {actions ? (
            actions
          ) : (
            <button
              onClick={onClose}
              className="px-6 py-2 bg-white text-black font-bold border-2 border-white hover:bg-gray-200 transition"
            >
              Close
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
