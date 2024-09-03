"use strict";
// Create Contact Us
/**
 * @swagger
 * /api/v1/contacts/create-contact-us:
 *   post:
 *     summary: Create a new contact message
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - message
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               message:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contact created successfully
 *       400:
 *         description: Error in creating contact
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
// Get All Contact Us Notification
/**
 * @swagger
 * /api/v1/contacts/get-contact-notification:
 *  get:
 *    summary: Get all unread contact messages
 *    tags: [Contacts]
 *    description: Get all unread contact messages
 *    responses:
 *      200:
 *        description: Payments retrieved successfully
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Not found
 *      500:
 *        description: Internal server error
 */
// Get All Contact Us List By Admin
/**
 * @swagger
 * /api/v1/contacts/get-contact-list-by-admin:
 *  get:
 *    summary: Get all contact messages
 *    tags: [Contacts]
 *    description: Get all contact messages
 *    responses:
 *      200:
 *        description: Payments retrieved successfully
 */
// Get Single Contact Us By Admin
/**
 * @swagger
 * /api/v1/contacts/get-single-contact-by-admin/{id}:
 *  get:
 *    summary: Get single contact message
 *    tags: [Contacts]
 *    description: Get single contact message
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Contact ID
 *        example: 12345
 *    responses:
 *      200:
 *        description: Payments retrieved successfully
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Not found
 *      500:
 *        description: Internal server error
 */
// Delete Contact Us By Admin
/**
 * @swagger
 * /api/v1/contacts/delete-contact-by-admin/{id}:
 *  delete:
 *    summary: Delete contact message
 *    tags: [Contacts]
 *    description: Delete contact message
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Contact ID
 *        example: 12345
 *    responses:
 *      200:
 *        description: Payments retrieved successfully
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Not found
 *      500:
 *        description: Internal server error
 */
