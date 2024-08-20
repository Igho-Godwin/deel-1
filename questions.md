
1. What is the difference between Component and PureComponent?
Give an example where it might break my app.

Answer: 

If neither the props nor the state has changed shallowly, PureComponent will skip the re-rendering of the component.

This can improve performance by reducing unnecessary re-renders, but it assumes that the props and state are immutable.

To make component update and cause render in pure components  you should ensure that the state is updated immutably but this is not true for normal components

In Summary:

Use Component if you need full control over the re-rendering logic or if you are dealing with complex state or props.

Use PureComponent to optimize performance in simple cases where shallow comparison suffices.



2. Context + ShouldComponentUpdate might be dangerous. Why is
that?

Answer:
When you use shouldComponentUpdate, you're telling React to skip re-rendering a component based on certain conditions, typically comparing the previous and next props and state. However, shouldComponentUpdate does not account for changes in context values. If you implement shouldComponentUpdate and it returns false, the component will not re-render even if the context value it relies on has changed. This can lead to outdated or incorrect data being displayed, as the component will not reflect the updated context.



3. Describe 3 ways to pass information from a component to its
PARENT.

Answer:
a. Callbacks: This means the parent component passes a function as prop to the child component. The child component can call this function and pass prop to it

b. Using Context Api: The context api can be called within child components in the componenet tree to update the context state.

c. Using callback Refs: You can use refs to pass information to the parent by creating a ref in the parent component and passing it to the child. The child component can then directly interact with the parent's methods or state via the ref.

4. Give 2 ways to prevent components from re-rendering.
Answer:

a. Using useMemo to memomize expensive calculations or derived values so that they are are only recalculated when dependencies change.

b. Using useCallback to memomize expensive functions so they are only recomputed when their dependencies change


5. What is a fragment and why do we need it? Give an example where it
might break my app.

Answer:
A Fragment in React is a wrapper component that allows you to group a list of children without adding extra nodes to the DOM. This is particularly useful when you want to return multiple elements from a component but avoid creating unnecessary DOM elements, like additional <div> wrappers.

Suituations where fragments can break app:
a. One situation where fragments could cause issues is when you are rendering a list of items. React requires a key prop to be provided for each list item to help it identify which items have changed, been added, or removed. However, the shorthand fragment syntax (<>) does not support the key prop

if you need to add a key prop to the fragment itself, you cannot do so with the shorthand syntax. You would need to use the full Fragment syntax.

b. Certain third-party libraries may expect a specific DOM structure, and using fragments could break these expectations.

6. Give 3 examples of the HOC pattern.

Answer:
a. WithAuthentication HOC: This HOC checks if a user is authenticated before rendering the wrapped component. If the user is not authenticated, it might redirect to a login page or show a message.

b.WithLoading HOC: This HOC adds a loading spinner to a component until some asynchronous data (like an API call) is fetched.

c. WithTheme HOC: This HOC provides theme-related props to the wrapped component, allowing it to adapt its styles based on the current theme. This can be part of a larger theming system in your application.

7. What's the difference in handling exceptions in promises,
callbacks and async...await?

Answer:
for callbacks error/exceptions is passed as the first argument, error/exceptions are handled with .catch() for promises and errors are handled with try...catch for async...await

8. How many arguments does setState take and why is it async.

Answer:
setState takes two arguments

The first Argument: a object of the state to update or a function that receives previous state and the current props as arguments which is great incase the new state depends on the previous state

The Second Argument is an optional callback function that is called after then state has been updated and component has been re-rendered

Why is setState Asynchronous:
a. Batching updates for performance: react may batch multiple setState calls in a single update to improve performance
b. asynchronous setState updates also ensures UI remains consistent with the latest state while synchronous, multiple state updates in quick succession could lead to inconsistencies in the UI, especially in complex applications

9. List the steps needed to migrate a Class to Function
Component.

Answer:

a. Create the Function Component and Replace the class declaration with a function. Remove the render method, and convert it into a function that returns JSX.

b. replace this.state and this.setState with useState hook

c. replace lifecycle methods (componentDidMount, componentDidUpdate, componentWillUnmount) with useEffect

d. access props directly as a function parameter. remove this.props

e. if your component has eventHandlers convert them to normal arrow functions

f. remove 'constructor', 'super' and 'this' keyword

g. check for context usage and convert it to use useContext hook

h. test the migrated component


10.List a few ways styles can be used with components.

Answer:
a. inline style which is directly applied to the style element in JSX

b. importing a css file to your component and making reference to your style classes and ids in your componenet JSX where needed

c using css modules which you import css files but they are locally scoped by default to the component they are imported to.


11. How to render an HTML string coming from the server.

Answer:
To render HTML string coming from the server you use 'dangerouslySetInnerHTML' an attribute provided by react which allows you to set inner HTML of a component. It is important to sanitize the HTML string from the server first before rendering it to prevent XSS attacks. You can sanitize using tools like 'DOMPurify'