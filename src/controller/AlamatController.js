import Alamat from "../models/AlamatModel.js";
import UserModel from "../models/UserModel.js";
import {
    response200,
    response201,
    response400,
    response401,
    response403,
    response404,
    response409,
    response422,
    response500,
} from "../utils/Response.js";


export const getAlamat = async (req, res) => {
    try {



        const alamat = await Alamat.findAll({
            include: [
                {
                    model: UserModel,
                    attributes: {
                        exclude: ["password", "refreshToken", "createdAt", "updatedAt"],
                    },
                },
            ],
        });
        if (alamat) {
            return res.status(200).json(response200(alamat));
        } else {
            return res.status(404).json(response404("Alamat not found"));
        }
    } catch (error) {
        return res.status(500).json(response500(error));
    }
};

export const getAlamatById = async (req, res) => {
    try {
        const alamat = await Alamat.findOne({
            where: {
                id: req.params.id,
            },
            include: [
                {
                    model: UserModel,
                    attributes: {
                        exclude: ["password", "refreshToken", "createdAt", "updatedAt"],
                    },
                },
            ],
        });
        if (alamat) {
            return res.status(200).json(response200(alamat));
        } else {
            return res.status(404).json(response404("Alamat not found"));
        }
    } catch (error) {
        return res.status(500).json(response500(error));
    }
};


export const getAlamatByCurentUser = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(401).json(response401("You are not authenticated"));

        const user = await UserModel.findOne({
            attributes: {
                exclude: ["password", "refreshToken", "createdAt", "updatedAt"],
            },
            where: {
                refreshToken: refreshToken,
            },
        });


        if (!user) {
            return res.status(403).json(response403("Invalid refresh token"));
        }


        const alamat = await Alamat.findAll({
            where: {
                userId: user.id,
            },
            include: [
                {
                    model: UserModel,
                    attributes: {
                        exclude: ["password", "refreshToken", "createdAt", "updatedAt"],
                    },
                },
            ],
        });
        if (alamat) {
            return res.status(200).json(response200(alamat));
        } else {
            return res.status(404).json(response404("Alamat not found"));
        }
    } catch (error) {
        return res.status(500).json(response500(error));
    }
};

export const getAlamatPrimary = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(401).json(response401("You are not authenticated"));

        const user = await UserModel.findOne({
            attributes: {
                exclude: ["password", "refreshToken", "createdAt", "updatedAt"],
            },
            where: {
                refreshToken: refreshToken,
            },
        });


        if (!user) {
            return res.status(403).json(response403("Invalid refresh token"));
        }


        const alamat = await Alamat.findOne({
            where: {
                userId: user.id,
                isPrimary: true,
            },
            include: [
                {
                    model: UserModel,
                    attributes: {
                        exclude: ["password", "refreshToken", "createdAt", "updatedAt"],
                    },
                },
            ],
        });
        if (alamat) {
            return res.status(200).json(response200(alamat));
        } else {
            return res.status(404).json(response404("Alamat not found"));
        }
    } catch (error) {
        return res.status(500).json(response500(error));
    }
};


export const createAlamat = async (req, res) => {
    const { kecamatan, kabupaten, provinsi, kodePos, nomorTelepon, namaPenerima } = req.body;

    let alamat = req.body.alamat;
    let isPrimary = req.body.isPrimary;

    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(401).json(response401("You are not authenticated"));

        const user = await UserModel.findOne({
            attributes: { exclude: ["password", "refreshToken"] },
            where: {
                refreshToken: refreshToken,
            },
        });


        if (!user) {
            return res.status(403).json(response403("Invalid refresh token"));
        }

        const alamatExists = await Alamat.findOne({
            where: {
                userId: user.id,
                alamat: alamat,
            },
        });

        if (alamatExists) {
            return res.status(409).json(response409("Alamat already exists"));
        }



        const detailAlamat = alamat + ", " + kecamatan + ", " + kabupaten + ", " + provinsi + ", " + kodePos + ", " + nomorTelepon + ", " + namaPenerima || user.name;



        if (isPrimary === true) {
            const alamatPrimary = await Alamat.update(
                {
                    isPrimary: false,
                },
                {
                    where: {
                        userId: user.id,
                    },
                }
            );

            if (!alamatPrimary) {
                return res.status(400).json(response400("Failed to create new alamat"));
            }
        } else {
            const alamatPrimary = await Alamat.findOne({
                where: {
                    userId: user.id,
                    isPrimary: true,
                },
            });

            if (!alamatPrimary) {
                isPrimary = true;
            }
        }


        const newAlamat = await Alamat.create({
            kecamatan: kecamatan,
            kabupaten: kabupaten,
            provinsi: provinsi,
            kodePos: kodePos,
            alamat: alamat || detailAlamat,
            nomorTelepon: nomorTelepon,
            namaPenerima: namaPenerima,
            isPrimary: isPrimary || false,
            userId: user.id,
        });

        if (newAlamat) {
            return res.status(201).json(response201("New alamat created successfully", newAlamat));
        } else {
            return res.status(400).json(response400("Failed to create new alamat"));
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json(response500(error.message));
    }
};

export const updatePrimaryAlamat = async (req, res) => {
    try {
        const { id } = req.params;
        const { isPrimary } = req.body;


        const alamat = await Alamat.findOne({
            where: {
                id: id,
            },
        });

        if (!alamat) {
            return res.status(404).json(response404("Alamat not found"));
        }

        if (isPrimary) {
            await Alamat.update(
                {
                    isPrimary: false,
                },
                {
                    where: {
                        userId: alamat.userId,
                    },
                }
            );
        }

        const updatedAlamat = await Alamat.update(
            {
                isPrimary: isPrimary,
            },

            {
                where: {
                    id: id,
                },
            }
        );

        if (updatedAlamat) {
            return res.status(200).json(response200(updatedAlamat));
        } else {
            return res.status(400).json(response400("Failed to update alamat"));
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json(response500(error.message));
    }
};


export const updateAlamat = async (req, res) => {
    try {
        const { id } = req.params;
        const { kecamatan, kabupaten, provinsi, kodePos, alamat, nomorTelepon, namaPenerima, isPrimary } = req.body;

        const alamatExists = await Alamat.findOne({
            where: {
                id: id,
            },
        });

        if (!alamatExists) {
            return res.status(404).json(response404("Alamat not found"));
        }

        if (isPrimary) {
            await Alamat.update(
                {
                    isPrimary: false,
                },
                {
                    where: {
                        userId: alamatExists.userId,
                    },
                }
            );
        } else {
            const alamatPrimary = await Alamat.findOne({
                where: {
                    userId: alamatExists.userId,
                    isPrimary: true,
                },
            });

            if (!alamatPrimary) {
                return res.status(422).json(response422("Please set one of your alamat as primary"));
            }
        }



        const updatedAlamat = await Alamat.update(
            {
                kecamatan: kecamatan,
                kabupaten: kabupaten,
                provinsi: provinsi,
                kodePos: kodePos,
                alamat: alamat,
                nomorTelepon: nomorTelepon,
                namaPenerima: namaPenerima,
                isPrimary: isPrimary,
            },
            {
                where: {
                    id: id,
                },
            }
        );

        if (updatedAlamat) {
            return res.status(200).json(response200(updatedAlamat));
        } else {
            return res.status(400).json(response400("Failed to update alamat"));
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(response500(error.message));
    }
};

export const deleteAlamat = async (req, res) => {
    try {
        const { id } = req.params;

        const alamat = await Alamat.findOne({
            where: {
                id: id,
            },
        });

        if (!alamat) {
            return res.status(404).json(response404("Alamat not found"));
        }

        const deletedAlamat = await Alamat
            .destroy({
                where: {
                    id: id,
                },
            })
            .catch((error) => {
                console.log(error);
                return res.status(500).json(response500(error.message));
            });

        if (deletedAlamat) {
            return res.status(200).json(response200(deletedAlamat));
        } else {
            return res.status(400).json(response400("Failed to delete alamat"));
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(response500(error.message));
    }
};

