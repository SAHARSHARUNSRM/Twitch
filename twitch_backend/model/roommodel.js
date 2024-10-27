const admin = require('../config/firebase'); 
const db = admin.firestore();
const createRoom = async (roomId, userName) => {
    
    try {
        const docRef = db.collection("room").doc(roomId);
        await docRef.set({
            host: userName,
        });
        return true;
    } catch (error) {
        console.error('Error creating room:', error);
        return false; 
    }
};
const joinRoom = async (roomId, userName) => {
    try {
        const docRef = db.collection("room").doc(roomId);
        const docSnapshot = await docRef.get(); 
        if (docSnapshot.exists) {
            const currentParticipants = docSnapshot.data().participants || [];

            await docRef.set({
                participants: [...currentParticipants, userName],
            }, {
                merge: true,
            });
            return true;
        } else {
            return false; 
        }
    } catch (error) {
        console.error('Error checking room existence:', error);
        return false; 
    }
};
const deleteRoom = async (roomId, userName) => {
    const docRef = db.collection("room").doc(roomId);
    const docSnapshot = await docRef.get();

    if (docSnapshot.exists) {
        const hostName = docSnapshot.data().host; 

        
        if (userName === hostName) {
            try {
                await docRef.delete(); 
                return true; 
            } catch (error) {
                console.log('Error deleting room:', error);
                return false; 
            }
        } else {
            const currentParticipants = docSnapshot.data().participants || [];
            const updatedParticipants = currentParticipants.filter(participant => participant !== userName);

            
            await docRef.set({
                participants: updatedParticipants, 
            }, {
                merge: true,
            });

            return true; 
        }
    } else {
        return false; 
    }
};

module.exports = {
    createRoom,
    joinRoom,
    deleteRoom,
};
