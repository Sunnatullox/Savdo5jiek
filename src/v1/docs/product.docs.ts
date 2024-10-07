// admin create product
/**
 * @swagger
 *  /api/v1/product/create-product-by-admin:
 *   post:
 *    summary: Create a new product by admin
 *    tags: [Product]
 *    description: Create a new product by admin
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              name_uz:
 *                type: string
 *                description: The name of the product in uzbek
 *                example: Product 1
 *              name_ru:
 *                type: string
 *                description: The name of the product in russian
 *                example: Product 1
 *              name_en:
 *                type: string
 *                description: The name of the product in english
 *                example: Product 1
 *              description_uz:
 *                type: string
 *                description: The description of the product in uzbek
 *                example: Product 1
 *              description_ru:
 *                type: string
 *                description: The description of the product in russian
 *                example: Product 1
 *              description_en:
 *                type: string
 *                description: The description of the product in english
 *                example: Product 1
 *              price:
 *                type: number
 *                description: The price of the product
 *                example: 100000
 *              discount:
 *                type: number
 *                description: The discount of the product
 *                example: 10
 *              categoryId:
 *                type: string
 *                description: The category of the product
 *                example: 1
 *              unit_uz:
 *                type: string
 *                description: The unit of the product in uzbek
 *                example: Product 1
 *              unit_ru:
 *                type: string
 *                description: The unit of the product in russian
 *                example: Product 1
 *              unit_en:
 *                type: string
 *                description: The unit of the product in english
 *                example: Product 1
 *              delivery_price:
 *                type: number
 *                description: The delivery price of the product
 *                example: 100000
 *              stock:
 *                type: number
 *                description: The stock of the product
 *                example: 500
 *              images:
 *                type: array
 *                description: The images of the product
 *                items:
 *                  type: string
 *                  format: binary
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

// get products
/**
 * @swagger
 *  /api/v1/product/get-products:
 *   get:
 *    summary: Get all products
 *    tags: [Product]
 *    description: Get all products
 *    parameters:
 *      - in: query
 *        name: page
 *        required: false
 *        description: The page number
 *      - in: query
 *        name: limit
 *        required: false
 *        description: The number of products per page
 *      - in: query
 *        name: search
 *        required: false
 *        description: The search query
 *      - in: query
 *        name: categorie
 *        required: false
 *        description: The category slug
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

// get products by admin
/**
 * @swagger
 *  /api/v1/product/get-products-by-admin:
 *   get:
 *    summary: Get all products by admin
 *    tags: [Product]
 *    description: Get all products by admin
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

// get top products
/**
 * @swagger
 *  /api/v1/product/get-top-products:
 *   get:
 *    summary: Get top products
 *    tags: [Product]
 *    description: Get top products
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

// get new products
/**
 * @swagger
 * /api/v1/product/get-new-products:
 *  get:
 *    summary: Get new products
 *    tags: [Product]
 *    responses:
 *      200:
 *        description: Products fetched successfully
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Internal server error
 */


// get product by id
/**
 * @swagger
 *  /api/v1/product/get-product/{id}:
 *   get:
 *    summary: Get a product by id
 *    tags: [Product]
 *    description: Get a product by id
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: The id of the product
 *        example: 1
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

// admin update product
/**
 * @swagger
 *  /api/v1/product/update-product-by-admin/{id}:
 *   put:
 *    summary: Update a product by admin
 *    tags: [Product]
 *    description: Update a product by admin
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: The id of the product
 *        example: 1
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              name_uz:
 *                type: string
 *                description: The name of the product in uzbek
 *                example: Product 1
 *              name_ru:
 *                type: string
 *                description: The name of the product in russian
 *                example: Product 1
 *              name_en:
 *                type: string
 *                description: The name of the product in english
 *                example: Product 1
 *              description_uz:
 *                type: string
 *                description: The description of the product in uzbek
 *                example: Product 1
 *              description_ru:
 *                type: string
 *                description: The description of the product in russian
 *                example: Product 1
 *              description_en:
 *                type: string
 *                description: The description of the product in english
 *                example: Product 1
 *              price:
 *                type: number
 *                description: The price of the product
 *                example: 100000
 *              discount:
 *                type: number
 *                description: The discount of the product
 *                example: 10
 *              categoryId:
 *                type: string
 *                description: The category of the product
 *                example: 1
 *              unit_uz:
 *                type: string
 *                description: The unit of the product in uzbek
 *                example: Product 1
 *              unit_ru:
 *                type: string
 *                description: The unit of the product in russian
 *                example: Product 1
 *              unit_en:
 *                type: string
 *                description: The unit of the product in english
 *                example: Product 1
 *              delivery_price:
 *                type: number
 *                description: The delivery price of the product
 *                example: 100000
 *              stock:
 *                type: number
 *                description: The stock of the product
 *                example: 500
 *              images:
 *                type: array
 *                description: The images of the product
 *                example: ["image1.jpg", "image2.jpg", "image3.jpg"]
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

// admin update product status
/**
 * @swagger
 *  /api/v1/product/update-product-status-by-admin/{id}:
 *   put:
 *    summary: Update a product status by admin
 *    tags: [Product]
 *    description: Update a product status by admin
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: The id of the product
 *        example: 1
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              status:
 *                type: boolean
 *                description: The status of the product
 *                example: true
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

// admin delete product
/**
 * @swagger
 *  /api/v1/product/delete-product-by-admin/{id}:
 *   delete:
 *    summary: Delete a product by admin
 *    tags: [Product]
 *    description: Delete a product by admin
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: The id of the product
 *        example: 1
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

