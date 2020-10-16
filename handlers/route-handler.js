const queryHandler = require('./../handlers/query-handler');
const CONSTANTS = require('./../config/constants');

'use strict';
class RouteHandler{

	async registerRouteHandler(request, response){
		const data = {
			username : (request.body.username).toLowerCase()
		};
		if(data.username === '') {
			response.status(CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
				error : true,
				message : CONSTANTS.USERNAME_NOT_FOUND
			});
		} else {
			try {
				data.online = 'Y' ;
				data.socketId = '' ;
				console.log(data.username.toLowerCase())
				const user = await queryHandler.getUserByUsername(data.username.toLowerCase());
				if (user === null || user === undefined) {
					const result = await queryHandler.registerUser(data);
					if (result === null || result === undefined) {
						response.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
							error : false,
							message : CONSTANTS.USER_REGISTRATION_FAILED
						});	           			
					} else {
						response.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
							error : false,
							userId : result.insertedId,
							message : CONSTANTS.USER_REGISTRATION_OK
						});
					}	           			
				} else {
					const result = await queryHandler.makeUserOnline(user._id);
					if (result === null || result === undefined) {
						response.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
							error : false,
							message : CONSTANTS.USER_REGISTRATION_FAILED
						});	           			
					} else {
						response.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
							error : false,
							userId : user._id,
							message : CONSTANTS.USER_REGISTRATION_OK
						});
					}	   
				}	           	
			} catch ( error ) {
				response.status(CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE).json({
					error : true,
					message : CONSTANTS.SERVER_ERROR_MESSAGE
				});
			}
		}
	}

	async userSessionCheckRouteHandler(request, response){
		let userId = request.body.userId;
		if (userId === '') {
			response.status(CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
				error : true,
				message : CONSTANTS.USERID_NOT_FOUND
			});
		} else {
			try {
				const result = await queryHandler.userSessionCheck({ userId : userId });
				response.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
					error : false,
					username : result.username,
					message : CONSTANTS.USER_LOGIN_OK
				});
			} catch(error) {
				response.status(CONSTANTS.SERVER_NOT_ALLOWED_HTTP_CODE).json({
					error : true,
					message : CONSTANTS.USER_NOT_LOGGED_IN
				});
			}
		}
	}

	async getMessagesRouteHandler(request, response){
		let userId = request.body.userId;
		let toUserId = request.body.toUserId;			
		if (userId == '') {
			response.status(CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
				error : true,
				message : CONSTANTS.USERID_NOT_FOUND
			});
		}else{
			try {
				const messagesResponse = await queryHandler.getMessages({
					userId:userId,
					toUserId: toUserId
				});
				response.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
					error : false,
					messages : messagesResponse
				});
			} catch ( error ){
				response.status(CONSTANTS.SERVER_NOT_ALLOWED_HTTP_CODE).json({
					error : true,
					messages : CONSTANTS.USER_NOT_LOGGED_IN
				});
			}
		}
	}

	routeNotFoundHandler(request, response){
		response.status(CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE).json({
			error : true,
			message : CONSTANTS.ROUTE_NOT_FOUND
		});
	}
}

module.exports = new RouteHandler();
