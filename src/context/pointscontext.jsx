// import React, { createContext, useContext, useCallback, useState } from 'react';
// import { useUser } from '@clerk/clerk-react';

// const PointsContext = createContext(null);

// export const PointsProvider = ({ children }) => {
//   const { user } = useUser();
//   const [totalPoints, setTotalPoints] = useState(() => 
//     Number(user?.publicMetadata?.points) || 0
//   );

//   const addPoints = useCallback(async (points) => {
//     if (!user) {
//       return;
//     }

//     try {
//       const newTotal = totalPoints + points;
      
//       await user.update({
//         publicMetadata: {
//           points: newTotal
//         }
//       });

//       setTotalPoints(newTotal);
//     } catch (error) {
//       console.error('Error adding points:', error);
//     }
//   }, [user, totalPoints]);

//   const subtractPoints = useCallback(async (points) => {
//     if (!user) {
//       console.warn('No authenticated user');
//       return;
//     }

//     try {
//       const newTotal = Math.max(0, totalPoints - points);
      
//       await user.update({
//         publicMetadata: {
//           points: newTotal
//         }
//       });

//       setTotalPoints(newTotal);
//     } catch (error) {
//       console.error('Error subtracting points:', error);
//     }
//   }, [user, totalPoints]);

//   const resetPoints = useCallback(async () => {
//     if (!user) {
//       console.warn('No authenticated user');
//       return;
//     }

//     try {
//       await user.update({
//         publicMetadata: {
//           points: 0
//         }
//       });

//       setTotalPoints(0);
//     } catch (error) {
//       console.error('Error resetting points:', error);
//     }
//   }, [user]);

//   const contextValue = {
//     totalPoints,
//     addPoints,
//     subtractPoints,
//     resetPoints
//   };

//   return (
//     <PointsContext.Provider value={contextValue}>
//       {children}
//     </PointsContext.Provider>
//   );
// };

// export const usePoints = () => {
//   const context = useContext(PointsContext);
  
//   if (context === null) {
//     throw new Error('usePoints must be used within a PointsProvider');
//   }
  
//   return context;
// };
