

/**
 * @swagger
 * /api/v1/user/login:
 *  post:
 *    summary: Login
 *    tags: [Auth]
 *    description: Login with one id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              code:
 *                type: string
 *    responses:
 *      '200':
 *        description: A successful response
 *      '400':
 *        description: Bad request
 *      '500':
 *        description: Internal server error
 */

/**
 * @swagger
 * /api/v1/user/logout:
 *  get:
 *    summary: Logout
 *    tags: [Auth]
 *    description: Logout user
 *    responses:
 *      '200':
 *        description: A successful response
 *      '400':
 *        description: Bad request
 *      '500':
 *        description: Internal server error
 */

/**
 * @swagger
 * /api/v1/user/get-me-user:
 *  get:
 *    summary: Get user
 *    tags: [User]
 *    description: Get user data
 *    responses:
 *      '200':
 *        description: A successful response
 *      '400':
 *        description: Bad request
 *      '500':
 *        description: Internal server error
 */

/**
 * @swagger
 * /api/v1/user/update-user-data:
 *  patch:
 *    summary: Update user
 *    tags: [User]
 *    description: Update user data
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              address:
 *                type: string
 *              phone_number:
 *                type: string
 *              oked:
 *                type: string
 *              x_r:
 *                type: string
 *              bank:
 *                type: string
 *              mfo:
 *                type: string
 *    responses:
 *      '200':
 *        description: A successful response
 *      '400':
 *        description: Bad request
 *      '500':
 *        description: Internal server error
 */
