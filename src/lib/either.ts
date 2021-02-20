export interface Left<A> {
	type: 'left';
	left: A;
}

export interface Right<B> {
	type: 'right';
	right: B;
}

export type Either<A, B> = Left<A> | Right<B>;

export const left = <A>(left: A): Left<A> => ({ type: 'left', left });

export const right = <B>(right: B): Right<B> => ({
	type: 'right',
	right,
});

export declare const isLeft: <A, B>(either: Either<A, B>) => either is Left<A>;

export declare const isRight: <A, B>(
	either: Either<A, B>
) => either is Right<B>;

export const fold = <A, B, T>(
	either: Either<A, B>,
	onLeft: (left: A) => T,
	onRight: (right: B) => T
): T => (isLeft(either) ? onLeft(either.left) : onRight(either.right));