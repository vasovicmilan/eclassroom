// Pomoćne funkcije za skripte u scripts/.
/** Izvlači "--ime vrednost" iz args (menja niz) i vraća vrednost ili undefined. */
export function takeOption(args, name) {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? undefined : args.splice(i, 2)[1];
}

/** Ispisuje poruku (ili listu poruka) na stderr i prekida skriptu. */
export function fail(messages) {
  console.error([].concat(messages).join('\n'));
  process.exit(1);
}
