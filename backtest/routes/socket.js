const cookie = require('cookie');
const { verify } = require('../modules/jwt');
const { query } = require('../modules/db');

const getIdAndName = socket => socket.handshake.headers['cookie'] && cookie.parse(socket.handshake.headers['cookie']).token && verify(cookie.parse(socket.handshake.headers['cookie']).token) || {};
const updateOnlineList = (io, roomName) => {
	const roomPeople = io.sockets.adapter.rooms.get(roomName) ? Array.from(io.sockets.adapter.rooms.get(roomName)).map(socket_id => ({
		id: io.sockets.sockets.get(socket_id).user_id,
		name: io.sockets.sockets.get(socket_id).name,
	})) : [];

	// notification(알림) to people
	io.to(roomName).emit('UPDATE_ONLINE_USERS', roomPeople);
}

const findSocketById = (io, id) => {
	const sockets = [];
	for (let socket of io.sockets.sockets.values()) {
		if (socket.user_id === id) {
			sockets.push(socket);
		}
	}
	
	return sockets;
};

module.exports = io => {
	io.on('connection', socket => {
		const { id, name } = getIdAndName(socket);

		if (id) {
			findSocketById(io, id).map(socket => socket.disconnect());
			socket.user_id = id;
			socket.name = name;
			socket.join('online');
			updateOnlineList(io, 'online');
			console.log(`JOIN ONLINE ${id}`);
		} else {
			socket.disconnect();
		}

        //SEND GENERAL MESSAGE
		socket.on('CHAT_GENERAL_MESSAGE', async msg => {
			const targetSockets = findSocketById(io, msg.targetId);

			await query(`INSERT INTO chat(SENDER, RECEIVER, CREATED_AT, MSG_TYPE, TEXT) SELECT f.id, t.user_id, '${msg.created_at}', ${msg.msg_type}, '${msg.message}' FROM users f, users t WHERE f.id = '${socket.user_id}' and t.id = '${msg.targetId}';`)

			if (targetSockets.length > 0) {
				targetSockets.forEach(soc => soc.emit('CHAT_GENERAL_MESSAGE', {
					message: msg.message,
					from_id: socket.user_id,
					from_name: socket.name,
					created_at: msg.created_at,
					msg_type: msg.msg_type
				}));
			}
		});
		
	//SEND RENDEVOUS MESSAGE
		socket.on('CHAT_RENDEVOUS_MESSAGE', async msg => {
			const targetSockets = findSocketById(io, msg.targetId);

			await query(`INSERT INTO chat(SENDER, RECEIVER, CREATED_AT, MSG_TYPE, TEXT, VALID_TIME) SELECT f.id, t.user_id, '${msg.created_at}', ${msg.msg_type}, '${msg.message}', ${msg.valid_time} FROM users f, users t WHERE f.id = '${socket.user_id}' and t.id = '${msg.targetId}'
			AND EXISTS (SELECT BD_NAME, FLOOR_NUM, SSID FROM location WHERE BD_NAME = '${msg.user_bd}' AND BD_NAME = '${msg.target_bd}' AND FLOOR_NUM = ${msg.user_floor} AND FLOOR_NUM = ${msg.target_floor} AND SSID = '${msg.user_ssid}' AND SSID = '${msg.target_ssid}';) ;`);

			if (targetSockets.length > 0) {
				targetSockets.forEach(soc => soc.emit('CHAT_RENDEVOUS_MESSAGE', {
					message: msg.message,
					from_id: socket.user_id,
					from_name: socket.name,
					created_at: msg.created_at,
					msg_type: msg.msg_type,
					valid_time: msg.valid_time,
					from_bd: msg.user_bd,
					to_bd: msg.target_bd,
					from_floor: msg.user_floor,
					to_floor: msg.target_floor,
					from_SSID: msg.user_ssid,
					to_SSID: msg.target_ssid

				}));
			}
		});
			
			

		socket.on("disconnect", () => {0
			if (socket.user_id) {
				socket.leave('online');
				updateOnlineList(io, 'online');
				console.log(`LEAVE ONLINE ${socket.user_id}`);
			}
		});
	});
};
