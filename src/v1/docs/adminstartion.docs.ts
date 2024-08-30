/**
 * @swagger
 * /api/v1/adminstrator/adminstrator-otp:
 *  post:
 *    summary: Send OTP to adminstrator email
 *    tags: [Auth]
 *    description: Send OTP to adminstrator email
 *    parameters:
 *      - name: type
 *        in: query
 *        description: The type of the adminstrator
 *        required: true
 *        schema:
 *          type: string
 *          enum: [admin, tax_agent]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              email:
 *                type: string
 *              password:
 *                type: string
 *    responses:
 *      '200':
 *        description: OTP sent successfully
 *      '400':
 *        description: User already exists
 *      '401':
 *        description: Unauthorized
 *      '500':
 *        description: Internal server error
 */

/**
 * @swagger
 * /api/v1/adminstrator/adminstrator-otp-verify:
 *  post:
 *    summary: Verify OTP for adminstrator and register
 *    tags: [Auth]
 *    description: Verify OTP for adminstrator and register
 *    parameters:
 *      - name: type
 *        in: query
 *        description: The type of the adminstrator
 *        required: true
 *        schema:
 *          type: string
 *          enum: [admin, tax_agent]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              otp:
 *                type: string
 *    responses:
 *      '200':
 *        description: OTP verified successfully
 *      '400':
 *        description: OTP not found
 *      '401':
 *        description: Unauthorized
 *      '500':
 *        description: Internal server error
 */

/**
 * @swagger
 * /api/v1/adminstrator/adminstrator-login:
 *  post:
 *    summary: Login adminstrator
 *    tags: [Auth]
 *    description: Login adminstrator
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *              twoFactorSecret:
 *                type: string
 *    responses:
 *      '200':
 *        description: Login successful
 *      '400':
 *        description: Invalid email or password
 *      '401':
 *        description: Unauthorized
 *      '500':
 *        description: Internal server error
 */

/**
 * @swagger
 * /api/v1/adminstrator/adminstrator-two-factor-auth-update:
 *  put:
 *    summary: Update two factor authentication
 *    tags: [Adminstrator]
 *    description: Update two factor authentication
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              secret:
 *                type: string
 *                description: The new secret of the adminstrator
 *              oldSecret:
 *                type: string
 *                description: The old secret of the adminstrator and two factor secret update
 *    responses:
 *      '200':
 *        description: Two factor authentication enabled
 *      '401':
 *        description: Unauthorized
 *      '500':
 *        description: Internal server error
 */

/**
 * @swagger
 * /api/v1/adminstrator/adminstrator-add-update-info:
 *  post:
 *    summary: Add or update adminstrator info
 *    tags: [Adminstrator]
 *    description: Add or update adminstrator info
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              company_name:
 *                type: string
 *              first_name:
 *                type: string
 *              middle_name:
 *                type: string
 *              sur_name:
 *                type: string
 *              address:
 *                type: string
 *              tel:
 *                type: string
 *              inn:
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
 *        description: Adminstrator info added or updated
 *      '401':
 *        description: Unauthorized
 *      '500':
 *        description: Internal server error
 */

/**
 * @swagger
 * /api/v1/adminstrator/adminstrator-info:
 *  get:
 *    summary: Get adminstrator info
 *    tags: [Adminstrator]
 *    description: Get adminstrator info
 *    responses:
 *      '200':
 *        description: Adminstrator info
 *      '401':
 *        description: Unauthorized
 *      '500':
 *        description: Internal server error
 */

