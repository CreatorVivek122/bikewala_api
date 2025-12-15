const express = require('express');
const router = express.Router();
const Asset = require('../models/Asset');


//Get All assets
router.get("/assets",async(req,res)=>{
    try{
        const assets = await Asset.find({}, {_id:0, assetname:1, imageurl:1, price:1});

        res.status(200).json({
            success:true,
            data: assets
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Faild to fetch asset images",
            error: error.message
        });
    }
});



// GET Single asset by name
router.get("/assets/:assetname", async(req,res)=>{
    try{
        const asset = await Asset.findOne(
            { assetname: req.params.assetname },
            { _id: 0, assetname:1, imageurl:1, price:1 }
        );

        if(!asset){
            return res.status(404).json({
                success:false,
                message: "Asset not found"
            });
        }

        res.status(200).json(asset);
    }catch(error){
        res.status(500)({
            success:false,
            message:"Error Fetching Asset",
            error: error.message
        });
    }
});




// POST create new asset
router.post("/assets", async (req, res) => {
  try {
    const { assetname, imageurl, price } = req.body;

    // 1. Basic validation
    if (!assetname || !imageurl || !price) {
      return res.status(400).json({
        success: false,
        message: "assetname, imageurl and price are required"
      });
    }

    // 2. Create asset
    const asset = await Asset.create({
      assetname,
      imageurl,
      price
    });

    // 3. Success response
    res.status(201).json({
      success: true,
      message: "Asset created successfully",
      data: {
        assetname: asset.assetname,
        imageurl: asset.imageurl,
        price: asset.price
      }
    });
  } catch (error) {
    // 4. Duplicate key error (unique index)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Asset name already exists"
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create asset",
      error: error.message
    });
  }
});


// POST bulk create assets
router.post("/assets/bulk", async (req, res) => {
  try {
    const assets = req.body;

    // 1. Validate request body
    if (!Array.isArray(assets) || assets.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body must be a non-empty array"
      });
    }

    // 2. Basic validation for each asset
    const formattedAssets = assets.map((asset, index) => {
      if (!asset.assetname || !asset.imageurl || !asset.price) {
        throw new Error(`Invalid asset at index ${index}`);
      }

      return {
        assetname: asset.assetname.trim(),
        imageurl: asset.imageurl.trim(),
        price: asset.price
      };
    });

    // 3. Insert many (unordered = continues even if one fails)
    const result = await Asset.insertMany(formattedAssets, {
      ordered: false
    });

    res.status(201).json({
      success: true,
      message: "Assets inserted successfully",
      insertedCount: result.length,
      data: result.map(a => ({
        assetname: a.assetname,
        imageurl: a.imageurl,
        price:a.price
      }))
    });
  } catch (error) {
    // Duplicate key errors are expected sometimes
    if (error.code === 11000 || error.writeErrors) {
      return res.status(207).json({
        success: true,
        message: "Some assets were inserted, duplicates skipped",
        insertedCount: error.result?.nInserted || 0
      });
    }

    res.status(500).json({
      success: false,
      message: "Bulk insert failed",
      error: error.message
    });
  }
});






module.exports=router;