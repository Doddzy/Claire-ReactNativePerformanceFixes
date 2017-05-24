# Claire-ReactNativePerformanceFixes
Performance fixes I've used so far to drastically help speed up react-native + redux project.

# Current team
Yo current team of secret origins. If you have issues with these sections, here are likely fixes:

## Changes take a long time to show
0. [dispatch](#dispatch)
0. [Re rendering](#Re-rendering)

## Lists take a long time to load
0. [ConnectAware](#ConnectAware)
0. [FlatLists](#FlatLists)
0. [Swiper](#Swiper)

## Section X gets slower when more jobs are added
0. [ConnectAware](#ConnectAware)

# Generally good to do

## Dispatch

Everytime you perform a dispatch it begins a long line of things digging around and re rendering.

This becomes a big issue if the next section hasn't been done properly as each dispatch often causes a full re render of the current page.

We had this error in many many many places, often a single button click would send out 6 dispatches which gets ridiculously expensive.

Current team: A big big candidate for performance improvements if you don't want to do the next section.

## Re rendering
### mapStateToProps
Make sure your map state to props only returns objects that be shallowly compared, then you get a lot of the benefits of redux + pure components.

In general be frugal about what you put in mapStateToProps, if you don't need it, don't add it.


### Pure components
Pure components are much much faster than normal 'Component's, they give you a nice simple shouldComponentUpdate function. They cause some issues around when to rerender.
But if your props and state are simple objects they're significantly faster.

### componentWillUpdate
A very very important function to squeezing out performance, if you couldn't do either of the above. This will save you from a re render hellscape.

Returns a boolean for whether a component should re render or not.

I'm quite a big fan of:
```
    const oldProps = this.props;
    lodash.isEqual(newProps, oldProps)
```

Be careful using it if you have ridiculously complex objects as isEqual can be expensive. But depending on how big the component is, can still be significantly better and very easy to do.

## onTextChange
Changes that happen on textChange must be ridiculously simple otherwise they will quickly kill performance.

i.e.: If you're dispatching an action on every keypress, someone typing quickly can send off hundreds of dispatches in seconds.

Instead go for a 50/100 ms poll while the person is changing text, update/validate then.

(See InputBox.js for example)

## Constructors, renders
Avoid doing complex operations in each of these areas, if these take a while it can cause noticeable lag to users.


## Anonymous functions
Anonymous functions are recreated every render if written thee. Give names and then it happens much less often.
Each defender of parent then forces defender if child as its passing in a NEW function.

## NODE_ENV production
if (process.env.NODE_ENV === 'production') occurs A LOT, you can use envify to remove them. Also can strip out __DEV__ calls

## Crossing between native code & js
Is really expensive to bridge the gap between native and js, try to avoid doing it if you can.

# Project specifics
## Lists
Connect base component that is rendered in a list so the whole thing doesn't defender on every change.

Use sensible keys (eg: Not index's if ordering of list is going to change, will cause wonderful bonus features).

### [FlatLists](https://facebook.github.io/react-native/docs/flatlist.html)
The new ReactNative FlatList is soooooooo much better than list view, seriously, it is ridiculous.

One component I was loading was taking ~45 seconds to load 500 rows using old "ListView".

Swapping that to FlatList dropped it down to 5 seconds and gave for free the ability to load chunks at a time.

It also uses a significantly easier interface.


## [Swiper](https://github.com/leecade/react-native-swiper)
It comes with a magical setting called loadMinimal.

I HIGHLY recommend using it, severely cuts down on re render things not currently on the screen.
Going too low can cause impact to users as it doesn't have as much of a buffer to scrolling.

Find the happy middle ground for your use case.

## ConnectAware

One of the issues we had is that as data increased, it was having massive impacts on performance.

Part of the solution to that was to reduce the scope of redux 'connect' to only bother with areas that could possibly be useful.

There's a lot more work to do here to shrink it down further, is a good candidate for future optimisations.
