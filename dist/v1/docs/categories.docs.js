"use strict";
/**
 * @swagger
 * /api/v1/categorie/create-categorie:
 *  post:
 *    tags: [Categories]
 *    summary: Create a new category
 *    description: Create a new category for Admin
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name_uz:
 *                type: string
 *              name_ru:
 *                type: string
 *              name_en:
 *                type: string
 *    responses:
 *      '200':
 *        description: A successful response
 *      '400':
 *        description: Bad request
 *      '401':
 *        description: Unauthorized
 *      '403':
 *        description: Forbidden
 *      '500':
 *        description: Internal server error
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @swagger
 * /api/v1/categorie/get-categories:
 *  get:
 *    tags: [Categories]
 *    summary: Get all categories
 *    description: Get all categories
 *    responses:
 *      '200':
 *        description: A successful response
 *      '401':
 *        description: Unauthorized
 *      '403':
 *        description: Forbidden
 *      '500':
 *        description: Internal server error
 */
/**
 * @swagger
 * /api/v1/categorie/get-categorie/{id}:
 *  get:
 *    tags: [Categories]
 *    summary: Get a category by id
 *    description: Get a category by id
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        type: string
 *    responses:
 *      '200':
 *        description: A successful response
 *      '401':
 *        description: Unauthorized
 *      '403':
 *        description: Forbidden
 *      '500':
 *        description: Internal server error
 */
/**
 * @swagger
 * /api/v1/categorie/update-categorie/{id}:
 *  put:
 *    tags: [Categories]
 *    summary: Update a category by id
 *    description: Update a category by id
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
 *              name_uz:
 *                type: string
 *              name_ru:
 *                type: string
 *              name_en:
 *                type: string
 *    responses:
 *      '200':
 *        description: A successful response
 *      '401':
 *        description: Unauthorized
 *      '403':
 *        description: Forbidden
 *      '500':
 *        description: Internal server error
 */
/**
 * @swagger
 * /api/v1/categorie/delete-categorie/{id}:
 *  delete:
 *    tags: [Categories]
 *    summary: Delete a category by id
 *    description: Delete a category by id
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        type: string
 *    responses:
 *      '200':
 *        description: A successful response
 *      '401':
 *        description: Unauthorized
 *      '403':
 *        description: Forbidden
 *      '500':
 *        description: Internal server error
 *
 */ 
