module("standard");

test("Basic requirements", function () {
	expect(2);
	ok(Base, "Base");
	ok(Base.extensions.standard, "Base.extensions.standard");
});

test("Valid base", function () {
	expect(5);

	strictEqual(Base.valid(2), true, "2");
	strictEqual(Base.valid(" 6"), false, "preceding space");
	strictEqual(Base.valid("36"), true, "36");
	strictEqual(Base.valid(10), true, "10");
	strictEqual(Base.valid(4.256), false, "4.256");
});

test("Convert between bases", function () {
	var i, kv, from, to, undefined,
		conversions = [
			{ from: 10, to: 2,
				"-000005.0000": "-101",
				"-0": "0",
				"-.5": "-0.1",
				".0625": "0.0001",
				"4.": "100",
				"" : undefined,
				"." : undefined,
				"-." : undefined,
				"-" : undefined,
				"A": undefined,
				"BCD": undefined,
				"0..5": undefined,
				"42.375": "101010.011"
			},
			{ from: 2, to: 36,
				"102": undefined,
				"-.0": "0",
				"-100100000100100100001110000010.101": "-A0B1C2.MI"
			},
			{ from: 10, to: 20,
				"0.61426": "0.C5E1C"
			},
			{ from: 20, to: 10,
				"0.C5E1C": "0.61426"
			}
		];

//	strictEqual(Base("A", 10, 2), undefined, "testing A");
//	strictEqual(Base("A", 10, 2), undefined, "testing A");
//	return;
	expect(conversions.length);

	function keys_and_values(obj) {
		var k = [], v = [], i;
		for (i in obj) {
			if (i === "to" || i === "from") {
				continue;
			}
			k.push(i);
			v.push(obj[i]);
		}
		return [k, v];
	}

	for (i = 0; i < conversions.length; i++) {
		kv = keys_and_values(conversions[i]);
		to = conversions[i].to;
		from = conversions[i].from;
		deepEqual(Base(from, to, kv[0]), kv[1], "base "+from+" > base "+to);
	}
});

test("Edge cases - rounded results accepted", function () {
	var i, j, k, result,
		conversions = [
			{ from: 16, to: 10,
				"abcdef123456.1" : [
					"188900967593046.0625",
					"188900967593046.063",
					"188900967593046.06",
					"188900967593046.1",
					"188900967593046"
				]
			},
			{ from: 16, to: 100,
				"abcdef12345.1" : [
					"11:80:63:10:47:45:65.6:25",
					"11:80:63:10:47:45:65.6",
					"11:80:63:10:47:45:65"
				]
			}
		];
	function in_array(elem, arr) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] === elem) {
				return true;
			}
		}
		return false;
	}
	for (i = 0; i < conversions.length; i++) {
		for (j in conversions[i]) {
			if (j === "from" || j === "to") {
				continue;
			}
			result = Base(conversions[i].from, conversions[i].to, j);
			if (in_array(result, conversions[i][j])) {
				ok(true, "correct conversion of '" + j + "'");
			} else {
				equal(result, conversions[i][j][0], "conversion of '" + j + "' (rounded results accepted)");
			}
		}
	}
	return;
	var result = Base(16, 10, "abcdef123456.1") + "";
	var expected = {
		"188900967593046.0625": true, // correct value
		"188900967593046.063": true, // any rounded value is fine too
		"188900967593046.06": true,
		"188900967593046.1": true,
		"188900967593046": true
	};
	if (!expected[result]) {
		ok(false, "expected 188900967593046.0625 or some rounded variant - got '" + result + "'");
	} else {
		ok(true, "correct conversion of 'abcdef123456.1'");
	}
});
