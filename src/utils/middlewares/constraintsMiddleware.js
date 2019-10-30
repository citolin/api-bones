const validate = require('validate.js')
    // const allConstraints = require('../../routes/constraints')

// constraintsMiddleware = (req, res, next) => {

//     const constraints = allConstraints[req.url]
//         // If there is no constraint for this route, then leave it be
//     if (!constraints) {
//         //console.log("[CONSTRAINTS] No constraints, next.")
//         return next()
//     }
//     const errors = validate(req.body, constraints)

//     if (errors) {
//         //console.log("[CONSTRAINTS] Constraint error.")
//         var errs = []
//         for (var key in errors) {
//             errors[key].forEach(el => {
//                 errs.push(el)
//             });
//         }
//         return res.status(500).send(errs)
//     } else {
//         //console.log("[CONSTRAINTS] Good to go. ")
//         return next()
//     }
// }

checkConstraint = (constraints, body) => {
    if (!constraints) {
        //console.log("[CONSTRAINTS] No constraints, next.")
        return undefined
    }
    const errors = validate(body, constraints)

    if (errors) {
        //console.log("[CONSTRAINTS] Constraint error.")
        var errs = []
        for (var key in errors) {
            errors[key].forEach(el => {
                errs.push(el)
            });
        }
        return errs
    } else {
        //console.log("[CONSTRAINTS] Good to go. ")
        return undefined
    }
}

module.exports = checkConstraint