const argv_original = process.argv.slice();

/**
 * 受け取った引数をコマンドライン引数として、atcoder-cliのコマンドラインからの呼び出しを再現する
 * @param args accに渡される引数(可変長)
 */
const run = (...args: Array<string>) => {
	process.argv = ["node", "acc", ...args];
	require("../../src/cli/index");
	process.argv = argv_original;
};

// コマンドラインからの呼び出しに対して、想定通りの関数が想定通りの引数で呼ばれていることをテストする
describe("command calls", () => {
	beforeEach(() => {
		// jest.resetModules()でcommandsも毎回別物になるので、jest.mockで毎回mockしなおす
		// そのためjest.clearAllMocks()は呼ばなくてもよい
		jest.mock("../../src/commands");
	});
	afterEach(() => {
		// cli/indexは一度しか呼べないため、テストのたびにリセットする
		jest.resetModules();
	});
	describe("acc new", () => {
		test("new abc100", () => {
			const commands = require("../../src/commands");
			run("new", "abc100");
			expect(commands.setup).toBeCalledWith("abc100", expect.anything());
			expect(commands.setup).not.toBeCalledWith("abc101", expect.anything());
		});
		test("n abc102 -c next -f", () => {
			const commands = require("../../src/commands");
			run("n", "abc102", "-c", "next", "-f");
			expect(commands.setup).toBeCalledWith("abc102", expect.objectContaining({tests: true, force: true, choice: "next"}));
			expect(commands.setup).toBeCalledWith("abc102", expect.not.objectContaining({template: expect.anything()}));
		});
		test("new abc103 --no-tests --no-template", () => {
			const commands = require("../../src/commands");
			run("new", "abc103", "--no-tests", "--no-template");
			expect(commands.setup).toBeCalledWith("abc103", expect.objectContaining({tests: false, template: false}));
			expect(commands.setup).toBeCalledWith("abc103", expect.not.objectContaining({choice: expect.anything()}));
		});
		test("new abc104 -t {TASKLABEL}", () => {
			const commands = require("../../src/commands");
			run("new", "abc104", "-t", "{TASKLABEL}");
			expect(commands.setup).toBeCalledWith("abc104", expect.objectContaining({taskDirnameFormat: "{TASKLABEL}"}));
		});
		// NOTE: not implemented option
		test("new abc105 -d {ContestTitle}", () => {
			const commands = require("../../src/commands");
			run("new", "abc105", "-d", "{ContestTitle}");
			expect(commands.setup).toBeCalledWith("abc105", expect.objectContaining({contestDirnameFormat: "{ContestTitle}"}));
		});
	});
	describe("acc add", () => {
		test("add", () => {
			const commands = require("../../src/commands");
			run("add");
			expect(commands.add).toBeCalledWith(expect.anything());
		});
		test("a -c next -f", () => {
			const commands = require("../../src/commands");
			run("a", "-c", "next", "-f");
			expect(commands.add).toBeCalledWith(expect.objectContaining({tests: true, force: true, choice: "next"}));
			expect(commands.add).toBeCalledWith(expect.not.objectContaining({template: expect.anything()}));
		});
		test("add -t {TASKLABEL}", () => {
			const commands = require("../../src/commands");
			run("a", "-t", "{TASKLABEL}");
			expect(commands.add).toBeCalledWith(expect.objectContaining({taskDirnameFormat: "{TASKLABEL}"}));
		});
		test("add --no-tests --no-template", () => {
			const commands = require("../../src/commands");
			run("add", "--no-tests", "--no-template");
			expect(commands.add).toBeCalledWith(expect.objectContaining({tests: false, template: false}));
			expect(commands.add).toBeCalledWith(expect.not.objectContaining({choice: expect.anything()}));
		});
	});
	describe("acc submit", () => {
		test("submit", () => {
			const commands = require("../../src/commands");
			run("submit");
			expect(commands.submit).toBeCalledWith(undefined, expect.anything());
		});
		test("s main.cpp", () => {
			const commands = require("../../src/commands");
			run("s", "main.cpp");
			expect(commands.submit).toBeCalledWith("main.cpp", expect.anything());
			expect(commands.submit).toBeCalledWith("main.cpp", expect.not.objectContaining({contest: expect.anything(), task: expect.anything()}));
		});
		test("s -c abc100 -t abc100_a", () => {
			const commands = require("../../src/commands");
			run("s", "-c", "abc100", "-t", "abc100_a");
			expect(commands.submit).toBeCalledWith(undefined, expect.objectContaining({contest: "abc100", task: "abc100_a"}));
		});
	});
	describe("acc tasks", () => {
		test("tasks abc101", () => {
			const commands = require("../../src/commands");
			run("tasks", "abc101");
			expect(commands.tasks).toBeCalledWith("abc101", expect.not.objectContaining({id: true}));
		});
		test("tasks -i abc101", () => {
			const commands = require("../../src/commands");
			run("tasks", "-i", "abc101");
			expect(commands.tasks).toBeCalledWith("abc101", expect.objectContaining({id: true}));
		});
	});
});