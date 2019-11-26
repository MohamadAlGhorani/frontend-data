// this function makes sure that the start angel, end angle and the inner radius on 0 are. for the animation.
//from https://www.youtube.com/watch?v=kK5kKA-0PUQ
import {
    arc
} from './helpers.js'

function pieTween(b) {
    b.innerRadius = 0;
    const i = d3.interpolate({
            startAngle: 0,
            endAngle: 0
        },
        b
    );
    return function (t) {
        return arc(i(t));
    };
}

export {
    pieTween
}