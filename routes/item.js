var express = require('express');
var router = express.Router(),
    item = require('../models/item');

/* GET users listing. */
router.get('/', function(req, res, next) {
    var pagingInfo = {};
    // pagingInfo.total=0;
    item.find().count(function(err, count) {
        if (err) console.log(err);
        else {
            pagingInfo.total = count;
        }
    });
    pagingInfo.page = req.query.page || 1;
    pagingInfo.perPage = 10;
    item.find({}, {}, { skip: (--pagingInfo.page) * pagingInfo.perPage, limit: pagingInfo.perPage }, function(err, documents) {
        if (err)
            return res.status(500).json(err);
        else
            return res.status(200).json({ data: documents, pagingInfo: pagingInfo })
    })
});
router.post('/', function(req, res, next) {
    item.create(req.body, function(err, data) {
        if (err)
            return res.status(400).json(err);
        else {
            res.status(201).json({ message: 'Added Successfully...', data: data });
        }
    })
});
router.put('/:id', function(req, res, next) {
    try {
        updates = {};
        req.body.params.forEach(function(e) {
            if (['name', 'price', 'brand'].indexOf(e.key) != -1) // simple params validator
                updates[e.key] = e.value;
        })
        item.updateOne({ '_id': req.params.id }, { $set: updates }, function(err, data) {
            if (err) return res.status(500).json(err);
            else {
                return res.status(202).json({ message: 'Updated Successfully...' })
            }
        })
    } catch (e) {
        console.log(e.message);
    }

})
router.delete('/:id', function(req, res, next) {
    item.remove({ '_id': req.params.id }, function(err) {
        if (err)
            return res.status(500);
        else {
            return res.status(200).json({ message: 'Deleted Successfully...' })
        }
    })
})


module.exports = router;