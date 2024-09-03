"use strict";
/**
 * @swagger
 * /api/v1/messages/send-message-user:
 *  post:
 *    summary: Send a message to the user
 *    tags: [Messages]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              contractId:
 *                type: string
 *                description: The ID of the contract
 *              message:
 *                type: string
 *                description: The message to send
 *    responses:
 *      200:
 *        description: Message sent successfully
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Internal server error
 *
 */
/**
 * @swagger
 * /api/v1/messages/send-message-admin:
 *  post:
 *    summary: Send a message to the user
 *    tags: [Messages]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              contractId:
 *                type: string
 *                description: The ID of the contract
 *              message:
 *                type: string
 *                description: The message to send
 *    responses:
 *      200:
 *        description: Message sent successfully
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Internal server error
 *
 */
/**
 * @swagger
 * /api/v1/messages/get-messages-user/{contractId}:
 *  get:
 *    summary: Get messages for the user
 *    tags: [Messages]
 *    parameters:
 *      - in: path
 *        name: contractId
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Messages fetched successfully
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Internal server error
 *
 */
/**
 * @swagger
 * /api/v1/messages/get-messages-admin/{contractId}:
 *  get:
 *    summary: Get messages for the admin
 *    tags: [Messages]
 *    parameters:
 *      - in: path
 *        name: contractId
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Messages fetched successfully
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Internal server error
 */
/**
 * @swagger
 * /api/v1/messages/get-notification-user:
 *  get:
 *    summary: Get notifications for the user
 *    tags: [Messages]
 *    responses:
 *      200:
 *        description: Notifications fetched successfully
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Internal server error
 */
/**
 * @swagger
 * /api/v1/messages/get-notification-admin:
 *  get:
 *    summary: Get notifications for the admin
 *    tags: [Messages]
 *    responses:
 *      200:
 *        description: Notifications fetched successfully
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Internal server error
 */
/**
 * @swagger
 * /api/v1/messages/delete-message-user/{messageId}:
 *  delete:
 *    summary: Delete a message for the user
 *    tags: [Messages]
 *    parameters:
 *      - in: path
 *        name: messageId
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Message deleted successfully
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Internal server error
 */
/**
 * @swagger
 * /api/v1/messages/delete-message-admin/{messageId}:
 *  delete:
 *    summary: Delete a message for the admin
 *    tags: [Messages]
 *    parameters:
 *      - in: path
 *        name: messageId
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Message deleted successfully
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized
 *      500:
 *
 */ 
