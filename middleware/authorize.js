const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access ditolak , Role tidak sesuai' });
    }

    next();
  };
};

module.exports = authorize;
