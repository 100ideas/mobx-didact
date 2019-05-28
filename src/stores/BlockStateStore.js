

// Blocks have a state

// state is full of recordSets

// other blocks might reference this blocks' state

// parts of this blocks' state might simply be references to the state of a thing
//   in another block or in a "collection"

// block might modify some part of its state that is resolved from another block
// - so it shouldn't change the state directly, but rather overload/resolve it 
//   with new value for downdstream referents

