"use strict";
/**
 * @swagger
 * /api/v1/contract/create-contract-by-user:
 *  post:
 *    summary: Create contract by user
 *    tags: [Contracts]
 *    description: Create contract by user
 *    requestBody:
 *      required: true

 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              products:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    id:
 *                      type: string
 *                    qty:
 *                      type: number
 *              totalPrice:
 *                type: number
 *              isDelivery:
 *                type: boolean
 *    responses:
 *      201:
 *        description: Contract created successfully
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Not found
 *      500:
 *        description: Internal server error
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @swagger
 * /api/v1/contract/get-contracts-list-by-user:
 *  get:
 *    summary: Get all contracts list by user
 *    tags: [Contracts]
 *    description: Get all contracts list by user
 *    responses:
 *      200:
 *        description: Contracts list retrieved successfully
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Not found
 *      500:
 *        description: Internal server error
 */
/**
 * @swagger
 * /api/v1/contract/get-contracts-by-admin:
 *  get:
 *    tags: [Contracts]
 *    summary: Get contracts by admin
 *    description: Get contracts by admin
 *    responses:
 *      200:
 *        description: Contracts retrieved successfully
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Not found
 *      500:
 *        description: Internal server error
 */
/**
 * @swagger
 * /api/v1/contract/get-contract-by-user/{id}:
 *  get:
 *    tags: [Contracts]
 *    summary: Get contract by user
 *    description: Get contract by user
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        type: string
 *    responses:
 *      200:
 *        description: Contract retrieved successfully
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Not found
 *      500:
 *        description: Internal server error
 */
/**
 * @swagger
 * /api/v1/contract/get-contract-by-admin/{id}:
 *  get:
 *    tags: [Contracts]
 *    summary: Get contract by admin
 *    description: Get contract by admin
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        type: string
 *    responses:
 *      200:
 *        description: Contract retrieved successfully
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Not found
 *      500:
 *        description: Internal server error
 */
/**
 * @swagger
 * /api/v1/contract/get-new-notifications-contract-by-admin:
 *  get:
 *    tags: [Contracts]
 *    summary: Get new notifications contract by admin
 *    description: Get new notifications contract by admin
 *    responses:
 *      200:
 *        description: New notifications contract retrieved successfully
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Not found
 *      500:
 *        description: Internal server error
 */
/**
 * @swagger
 * /api/v1/contract/update-contract-status-by-admin/{id}:
 *  put:
 *    tags: [Contracts]
 *    summary: Update contract status by admin
 *    description: Update contract status by admin
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        type: string
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              status:
 *                type: string
 *    responses:
 *      200:
 *        description: Contract status updated successfully
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Not found
 *      500:
 *        description: Internal server error
 */
/**
 * @swagger
 * /api/v1/contract/upload-contract-delivery-doc/{id}:
 *  post:
 *    tags: [Contracts]
 *    summary: Upload contract delivery doc
 *    description: Upload contract delivery doc
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        type: string
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              contract_delivery_doc:
 *                type: file
 *                format: binary
 *    responses:
 *      200:
 *        description: Contract delivery doc uploaded successfully
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Not found
 *      500:
 *        description: Internal server error
 */
/**
 * @swagger
 * /api/v1/contract/delete-contract-by-admin/{id}:
 *  delete:
 *    tags: [Contracts]
 *    summary: Delete contract by admin
 *    description: Delete contract by admin
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        type: string
 *    responses:
 *      200:
 *        description: Contract deleted successfully
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Not found
 *      500:
 *        description: Internal server error
 */
/**
 * @swagger
 * /api/v1/contract/get-contracts-by-tax-agent:
 *  get:
 *    tags: [Contracts]
 *    summary: Get contracts by tax agent
 *    description: Get contracts by tax agent
 *    responses:
 *      200:
 *        description: Contracts retrieved successfully
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Not found
 *      500:
 *        description: Internal server error
 */
