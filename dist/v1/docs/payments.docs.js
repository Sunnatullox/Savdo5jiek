"use strict";
// Create payment by user
/**
 * @swagger
 * /api/v1/payments/create-payment/{id}:
 *   post:
 *     summary: Create a payment by user
 *     tags: [Payments]
 *     description: Create a new payment by user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Contract ID
 *         example: 12345
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Amount of the payment
 *                 example: 50000
 *               paidDate:
 *                 type: string
 *                 format: date
 *                 description: Date when the payment was made
 *                 example: '2023-01-01'
 *               receiptImage:
 *                 type: string
 *                 format: binary
 *                 description: Receipt image for the payment
 *     responses:
 *       '201':
 *         description: Payment created successfully
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @swagger
 * /api/v1/payments/get-payments-by-user:
 *  get:
 *    summary: Get payments by user
 *    tags: [Payments]
 *    description: Get payments by user
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
// Get payment by user
/**
 * @swagger
 * /api/v1/payments/get-payment-by-user/{id}:
 *  get:
*    summary: Get payment by user
 *    tags: [Payments]
 *    description: Get payment by user
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Payment ID
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
// Get payments by contract
/**
 * @swagger
 * /api/v1/payments/get-payments-by-contract-id-admin/{id}:
 *  get:
 *    summary: Get contract id by payment user
 *    tags: [Payments]
 *    description: Get contract id by payment user
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Contract ID
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
// Get payment by admin
/**
 * @swagger
 * /api/v1/payments/get-payment-by-admin/{id}:
 *  get:
 *    summary: Get payment by admin
 *    tags: [Payments]
 *    description: Get payments by admin
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Payment ID
 *        example: 12345
 *    responses:
 *      200:
 *        description: Payments fetched successfully
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Not found
 *      500:
 *        description: Internal server error
 */
// Get payment by contract admin
/**
 * @swagger
 * /api/v1/payments/get-contractid-by-payment-admin/{id}:
 *  get:
 *    summary: Get contract id by payment admin
 *    tags: [Payments]
 *    description: Get contract id by payment admin
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Contract ID
 *        example: 12345
 *    responses:
 *      200:
 *        description: Payments fetched successfully
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Not found
 *      500:
 *        description: Internal server error
 */
// Get payments by admin
/**
 * @swagger
 * /api/v1/payments/get-payments-by-admin:
 *  get:
 *    summary: Get payments by admin
 *    tags: [Payments]
 *    description: Get payments by admin
 *    responses:
 *      200:
 *        description: Payments fetched successfully
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Not found
 *      500:
 *        description: Internal server error
 */
// Get notifications by payment admin
/**
 * @swagger
 * /api/v1/payments/get-notifications-by-payment-admin:
 *  get:
 *    summary: Get notifications by payment admin
 *    tags: [Payments]
 *    description: Get notifications by payment admin
 *    responses:
 *      200:
 *        description: Notifications fetched successfully
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Not found
 *      500:
 *        description: Internal server error
 */
// Update payment by user
/**
 * @swagger
 * /api/v1/payments/update-payment-by-user/{id}:
 *   put:
 *     summary: Update a payment by user
 *     tags: [Payments]
 *     description: Update an existing payment by user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Payment ID
 *         example: 12345
 *     requestBody:
 *       required: true
 *       content:
 *        multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: New amount of the payment
 *                 example: 55000
 *               paidDate:
 *                 type: string
 *                 format: date
 *                 description: New date of the payment
 *                 example: '2023-01-02'
 *               receiptImage:
 *                 type: string
 *                 format: binary
 *                 description: Receipt image for the payment
 *     responses:
 *       '200':
 *         description: Payment updated successfully
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Payment not found
 *       '500':
 *         description: Internal server error
 */
// Update payment by admin
/**
 * @swagger
 * /api/v1/payments/update-payment-by-admin/{id}:
 *   put:
 *     summary: Update a payment by admin
 *     tags: [Payments]
 *     description: Update an existing payment by admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Payment ID
 *         example: 12345
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: New amount of the payment
 *                 example: 55000
 *               paidDate:
 *                 type: string
 *                 format: date
 *                 description: New date of the payment
 *                 example: '2023-01-02'
 *     responses:
 *       '200':
 *         description: Payment updated successfully
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Payment not found
 *       '500':
 *         description: Internal server error
 */
// Update payment status
/**
 * @swagger
 * /api/v1/payments/update-payment-status/{id}:
 *  put:
 *    summary: Update payment status
 *    tags: [Payments]
 *    description: Update payment status
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Payment ID
 *        example: 12345
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              status:
 *                type: string
 *                description: New status of the payment
 *                example: 'approved'
 *    responses:
 *      200:
 *        description: Payment status updated successfully
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Payment not found
 *      500:
 *        description: Internal server error
 */
// Delete payment by user
/**
 * @swagger
 * /api/v1/payments/delete-payment-by-user/{id}:
 *   delete:
 *     summary: Delete a payment by user
 *     tags: [Payments]
 *     description: Delete a payment by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Payment ID
 *         example: 12345
 *     responses:
 *       '200':
 *         description: Payment deleted successfully
 *       '400':
 *         description: Payment cannot be deleted, it is approved
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Payment not found
 *       '500':
 *         description: Internal server error
 */
// Delete payment by admin
/**
 * @swagger
 * /api/v1/payments/delete-payment-by-admin/{id}:
 *   delete:
 *     summary: Delete a payment by admin
 *     tags: [Payments]
 *     description: Delete a payment by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Payment ID
 *         example: 12345
 *     responses:
 *       '200':
 *         description: Payment deleted successfully
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Payment not found
 *       '500':
 *         description: Internal server error
 */ 
