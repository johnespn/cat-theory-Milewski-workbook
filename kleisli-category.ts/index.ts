
/**
 * Original translation using <bool,string> pairs
 */
export const composeWithBooleansLogger = () => {

    type Pair<A,S> = [ A,S ]
    type F<A,S> = (a:A) => Pair<A,S>
    type G<B,S> = (b:B) => Pair<B,S>
    const negate = (x: boolean):Pair<boolean,string> => [!x, `negate(${x}); `]

    const composeOverBoolean = ( f: F<boolean, string>, g: G<boolean, string>) => {
        return (x:boolean) => {
            const p1 = f(x)
            const p2 = g(p1["0"])
            return [p2["0"], p2["1"].concat(p1["1"]) ]
        }
    }
    const negateTwice = composeOverBoolean(negate, negate)(true)
    console.log(negateTwice)

}
/**
 * Abstracting the join function
 */
export const composeWithGenericsLogger_Negate = () => {
    type Pair<A,S> = [ A,S ]
    type F<A,S> = (a:A) => Pair<A,S>
    type G<B,S> = (b:B) => Pair<B,S>
    const negate = (x: boolean):Pair<boolean,string> => [!x, `negate(${x}); `]

    const compose = <A,B> ( join: (b1:B, b2:B) => B ) => ( f: F<A, B>) => (g: G<A, B> ) => {
        return (x:A) => {
            const p1 = f(x)
            const p2 = g(p1["0"])
            return [p2["0"], join(p2["1"],(p1["1"])) ]
        }
    }

    const appendLog = (a:string, b:string):string => a.concat(b)
    const composeWithLogging = compose<boolean,string>( appendLog )
    const doubleNegationResult = composeWithLogging( negate )( negate )(true)

    console.log(doubleNegationResult)
}

/**
 * Using number => number functions
 */
export const composeWithGenericsLogger_Add10Duplicate = () => {
    type Pair<A,S> = [ A,S ]
    type F<A,S> = (a:A) => Pair<A,S>
    type G<B,S> = (b:B) => Pair<B,S>

    const compose = <A,B> ( join: (b1:B, b2:B) => B ) => ( f: F<A, B>) => (g: G<A, B> ) => {
        return (x:A) => {
            const p1 = f(x)
            const p2 = g(p1["0"])
            return [p2["0"], join(p2["1"],(p1["1"])) ]
        }
    }
    const add10 = (x:number):Pair<number,string>  => [x + 10, "add10(); "]
    const duplicate = (x:number):Pair<number,string>  => [ 2 * x, " duplicate(); "]
    const appendLog = (a:string, b:string):string => a.concat(b)

    const composeWithLogging = compose<number,string>( appendLog )
    const add10AndDuplicate = composeWithLogging( add10 )( duplicate)

    // 10 => [ 20, 'add10(); ' ] => [ 40, ' duplicate(); add10(); ' ]
    console.log( add10AndDuplicate(10) )

}

/**
 * Using diffrent types compositions
 */
export const composeWithGenericsLogger_add10I_after_isOdd = () => {
    type Pair<A,S> = [ A,S ]
    type Fn<A,B,S> = (a:A) => Pair<B,S>

    type H<X,Y,Z> = (x:X) => [Y,Z] 
    //f & g are kleisli arrows : type Fn<A, B, S> = (a: A) => [B, S]
    // these arrows are composable because this embelishment is a monad (a: A) => [B, S]
    // A monad is not special, is a way to comopse special type of functions
    // If i define one additional degree of freedom in defining composition, im using a monad
    const compose = <A,B,C,S> ( join: (b1:S, b2:S) => S ) => ( f: Fn<A,B, S>) => (g: Fn<B,C, S> ) => {
        return (x:A) => {
            const p1 = f(x)
            const p2 = g(p1["0"])
            return [p2["0"], join(p2["1"],(p1["1"])) ]
        }
    }
    const appendLog_monoid = (a:string, b:string):string => b.concat(a)
    
    const add10 = (x:number):Pair<number,string>  => [x + 10, "add10(); "]
    const isOdd = (x:number):Pair<boolean,string>  => [ (x%2==0), " isOdd(); "]

    const composableLogger = compose<number,number,boolean,string>( appendLog_monoid )
    const composed = composableLogger ( add10 )( isOdd )
    
    // 10 => [ 20, 'add10(); ' ] => [ true, ' add10(); isOdd(); ' ]
    console.log( composed(10) )
    
    }