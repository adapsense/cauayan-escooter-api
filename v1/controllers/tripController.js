const Trip = require("../models/Trip");

exports.getTrips = async (req, res) => {

    var user = req.user;

    const { trip } = req.body;

    if(user.userType.isAdmin) {
        Trip.find(trip)
            .populate({
                path: "user",
                model: "User",
                select: "-password",
                populate: [
                    {
                        path: "userType",
                        model: "UserType",
                    },
                    {
                        path: "userGroup",
                        model: "UserGroup",
                        match: {
                            _id: user.userGroup._id,
                        },
                    },
                    {
                        path: "userStatus",
                        model: "UserStatus",
                    },
                ],
            })
            .populate({
                path: "vehicle",
                model: "Vehicle",
                select: "_id name label",
            })
            .exec(function (err, data) {
                if (err)
                    return res.status(500).json({
                        success: false,
                        error: err,
                    });
                var trips = [];
                data.forEach((trip) => {
                    if(trip.user) {
                        trips.push(trip);
                    }
                });
                return res.status(200).json({ success: true, trips: trips});
            });
    } else {
        Trip.find(trip)
            .populate({
                path: "vehicle",
                model: "Vehicle",
                select: "_id name label",
            })
            .exec(function (err, data) {
                if (err)
                    return res.status(500).json({
                        success: false,
                        error: err,
                    });
                return res.status(200).json({ success: true, trips: data });
            });
    }

    
};

exports.addTrip = async (req, res) => {
    const { trip } = req.body;

    if (!trip) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    if(!trip.user) {
        trip.user = req.user._id;
    }

    Trip(trip).save(async function(tripSaveErr, tripSaveData) {
        if (tripSaveErr)
            return res.status(500).json({ success: false, error: tripSaveErr });
        await tripSaveData.populate({
            path: "vehicle",
            model: "Vehicle",
            select: "_id name label",
        }).execPopulate();
        return res
            .status(200)
            .json({ success: true, trip: tripSaveData});
    });
};

exports.updateTrip = async (req, res) => {
    const { trip } = req.body;

    if (!trip) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    if (!trip._id) {
        Trip.findOne({
                vehicle: trip.vehicle,
                lockTime: null,
                endLocation: null,
            })
            .lean()
            .exec((tripFindErr, tripFindData) => {
                if (tripFindErr || !tripFindData)
                    return res.status(200).json({ success: true, trip: null });
                tripFindData.lockTime = Date.now();
                tripFindData.endLocation = trip.endLocation;
                update(tripFindData, res);
            });
    } else {

        trip.lockTime = Date.now();

        update(trip, res);

    }

};

function update(trip, res) {
    Trip.findByIdAndUpdate( trip._id, trip, { new: true })
        .populate({
            path: "vehicle",
            model: "Vehicle",
            select: "_id name label",
        })
        .exec((err, data) => {
            if (err)
                return res.status(500).json({ success: false, error: err });
            return res.status(200).json({ success: true, trip: data });
        }
    );
}

exports.deleteTrip = async (req, res) => {
    const id = req.query.id;

    if (!id) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters.",
        });
    }

    Trip.deleteOne({ _id: id }, function (err, data) {
        if (err)
            return res.status(500).json({
                success: false,
                error: err,
            });
        return res.status(204).send();
    });
};
