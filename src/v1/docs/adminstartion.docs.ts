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
 *              twoFactorSecret:
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
 * /api/v1/adminstrator/adminstrator-update:
 *  put:
 *    summary: Update adminstrator
 *    tags: [Adminstrator]
 *    description: Update adminstrator
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
 *              oldPassword:
 *                type: string
 *    responses:
 *      '200':
 *        description: Admin updated successfully
 *      '401':
 *        description: Unauthorized
 *      '400':
 *        description: Old password is required
 *      '500':
 *        description: Internal server error
 */

/**
 * @swagger
 * /api/v1/adminstrator/adminstrator-two-factor-auth-update-and-create:
 *  post:
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
 * /api/v1/adminstrator/get-me-adminstrator:
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

/**
 * @swagger
 * /api/v1/adminstrator/delete-admin-device/{device_id}:
 *  delete:
 *    summary: Delete admin device
 *    tags: [Adminstrator]
 *    description: Delete admin device
 *    parameters:
 *      - name: device_id
 *        in: path
 *        description: The id of the device
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      '200':
 *        description: Device deleted
 *      '401':
 *        description: Unauthorized
 *      '500':
 *        description: Internal server error
 */

/**
 * @swagger
 * /api/v1/adminstrator/delete-admin-profile:
 *  delete:
 *    summary: Delete admin profile
 *    tags: [Adminstrator]
 *    description: Delete admin profile
 *    responses:
 *      '200':
 *        description: Profile deleted
 *      '401':
 *        description: Unauthorized
 *      '500':
 *        description: Internal server error
 */

/**
 * @swagger
 * /api/v1/adminstrator/get-all-tax-agents:
 *  get:
 *    summary: Get all tax agents
 *    tags: [Adminstrator]
 *    description: Get all tax agents
 *    responses:
 *      '200':
 *        description: Tax agents
 *      '401':
 *        description: Unauthorized
 *      '500':
 *        description: Internal server error
 */

/**
 * @swagger
 * /api/v1/adminstrator/get-tax-agent-by-id/{id}:
 *  get:
 *    summary: Get tax agent by id
 *    tags: [Adminstrator]
 *    description: Get tax agent by id
 *    parameters:
 *      - name: id
 *        in: path
 *        description: The id of the tax agent
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      '200':
 *        description: Tax agent
 *      '401':
 *        description: Unauthorized
 *      '500':
 *        description: Internal server error
 */

/**
 * @swagger
 * /api/v1/adminstrator/update-tax-agent/{id}:
 *  put:
 *    summary: Update tax agent
 *    tags: [Adminstrator]
 *    description: Update tax agent
 *    parameters:
 *      - name: id
 *        in: path
 *        description: The id of the tax agent
 *        required: true
 *        schema:
 *          type: string
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
 *              twoFactorSecret:
 *                type: string
 *    responses:
 *      '200':
 *        description: Tax agent updated
 *      '401':
 *        description: Unauthorized
 *      '500':
 *        description: Internal server error
 */

/**
 * @swagger
 * /api/v1/adminstrator/delete-tax-agent/{id}:
 *  delete:
 *    summary: Delete tax agent
 *    tags: [Adminstrator]
 *    description: Delete tax agent
 *    parameters:
 *      - name: id
 *        in: path
 *        description: The id of the tax agent
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      '200':
 *        description: Tax agent deleted
 *      '401':
 *        description: Unauthorized
 *      '500':
 *        description: Internal server error
 */ 

/**
 * @swagger
 * /api/v1/adminstrator/get-contracts-by-approved:
 *  get:
 *    summary: Get contracts by approved
 *    tags: [Adminstrator]
 *    description: Get contracts by approved
 *    responses:
 *      '200':
 *        description: Contracts by approved
 *      '401':
 *        description: Unauthorized
 *      '500':
 *        description: Internal server error
 */ 