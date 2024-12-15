export const authAdmin = async (req: any, res: any, next: any) => {
    try {
        const authUser = req.user;
        if (!authUser || !authUser.role || authUser.role < 1) {
            return res
                .status(400)
                .json({ err: 'wrong-auth' });
        }

        next();
    } catch (err: any) {
        return res.status(500).json({ err: err.message });
    }
};
