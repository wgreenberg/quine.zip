quine.zip
=========

[Try the puzzle here!](http://wgreenberg.github.io/quine.zip)

A while ago, I found a website with a simple but devilishly difficult puzzle:
given a minimal "programming" language, write a
[quine](https://en.wikipedia.org/wiki/Quine_(computing)).  Unfortunately I've
since forgotten where to find the puzzle, so I rewrote it myself.

The language mentioned above is composed of two primitives:

* `print M`: print the following `M` lines of input verbatim (and don't
  interpret them)
* `repeat M N`: print the last `M` lines of output verbatim, starting `N` lines
  before the end of output.

As it turns out, these two primitives make up the LZ77 decompression algorithm
used to unpack ZIP files, and so if you can make a quine out of these, you can
theoretically write a ZIP file that unzips to itself. Cool beans!

Further reading (spoiler alert for those attempting the quine puzzle):

* http://steike.com/code/useless/zip-file-quine/
* http://research.swtch.com/zip
* http://www.cs.helsinki.fi/u/tpkarkka/opetus/12k/dct/lecture07.pdf
