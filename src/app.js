"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
// Simple React app to guide users through Business Central setup
var useState = React.useState, useEffect = React.useEffect;
function App() {
    var _a = useState(0), step = _a[0], setStep = _a[1];
    var _b = useState(''), rapidStart = _b[0], setRapidStart = _b[1];
    var _c = useState({
        companyName: '',
        address: '',
        country: '',
        postingGroup: '',
        paymentTerms: '',
    }), formData = _c[0], setFormData = _c[1];
    var _d = useState(''), downloadUrl = _d[0], setDownloadUrl = _d[1];
    var _e = useState([]), debugMessages = _e[0], setDebugMessages = _e[1];
    function logDebug(msg) {
        setDebugMessages(function (m) { return __spreadArray(__spreadArray([], m, true), [msg], false); });
        console.log(msg);
    }
    useEffect(function () {
        // Load starting data from Azure Blob Storage
        function loadStartingData() {
            return __awaiter(this, void 0, void 0, function () {
                var resp, data, key, val, terms_1, first, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            logDebug('Loading starting data');
                            return [4 /*yield*/, fetch('https://bconfigstorage.blob.core.windows.net/bctemplates/NAV27.0.US.ENU.EXTENDED.json')];
                        case 1:
                            resp = _a.sent();
                            return [4 /*yield*/, resp.json()];
                        case 2:
                            data = _a.sent();
                            logDebug('Starting data loaded');
                            setRapidStart(JSON.stringify(data));
                            key = Object.keys(data).find(function (k) { return k.toLowerCase().includes('payment') && k.toLowerCase().includes('term'); });
                            if (key) {
                                val = data[key];
                                terms_1 = '';
                                if (typeof val === 'string') {
                                    terms_1 = val;
                                }
                                else if (Array.isArray(val)) {
                                    first = val[0];
                                    if (typeof first === 'string')
                                        terms_1 = first;
                                    else if (first && typeof first === 'object')
                                        terms_1 = first.Code || first.Description || '';
                                }
                                else if (val && typeof val === 'object') {
                                    terms_1 = val.Code || val.Description || '';
                                }
                                setFormData(function (f) { return (__assign(__assign({}, f), { paymentTerms: terms_1 })); });
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            e_1 = _a.sent();
                            console.error('Failed to load starting data', e_1);
                            logDebug("Failed to load starting data: ".concat(e_1));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
        loadStartingData();
    }, []);
    function handleChange(e) {
        var _a;
        setFormData(__assign(__assign({}, formData), (_a = {}, _a[e.target.name] = e.target.value, _a)));
    }
    function next() {
        setStep(step + 1);
    }
    function back() {
        setStep(step - 1);
    }
    function askOpenAI(question) {
        return __awaiter(this, void 0, void 0, function () {
            var resp, data, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        logDebug("Asking OpenAI: ".concat(question));
                        return [4 /*yield*/, fetch('/api/openai', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ question: question }),
                            })];
                    case 1:
                        resp = _a.sent();
                        return [4 /*yield*/, resp.json()];
                    case 2:
                        data = _a.sent();
                        alert(data.answer);
                        logDebug('OpenAI answered');
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _a.sent();
                        console.error(e_2);
                        logDebug("OpenAI call failed: ".concat(e_2));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function generateCustomRapidStart() {
        return __awaiter(this, void 0, void 0, function () {
            var xml, fileName, cfg, az, blobServiceClient, containerClient, blockBlobClient, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logDebug('Preparing RapidStart XML');
                        xml = "<?xml version=\"1.0\"?>\n<CustomRapidStart>\n  <CompanyName>".concat(formData.companyName, "</CompanyName>\n  <Address>").concat(formData.address, "</Address>\n  <Country>").concat(formData.country, "</Country>\n  <PostingGroup>").concat(formData.postingGroup, "</PostingGroup>\n  <PaymentTerms>").concat(formData.paymentTerms, "</PaymentTerms>\n</CustomRapidStart>");
                        fileName = "".concat((formData.companyName || 'CustomRapidStart')
                            .replace(/\s+/g, '_'), ".rapidstart");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        cfg = window.azureStorageConfig || {};
                        if (!cfg.connectionString) {
                            throw new Error('Azure connection string not configured');
                        }
                        logDebug('Connecting to Azure Blob Storage');
                        az = window.azblob;
                        if (!az) {
                            throw new Error('Azure Storage library not loaded');
                        }
                        blobServiceClient = az.BlobServiceClient.fromConnectionString(cfg.connectionString);
                        containerClient = blobServiceClient.getContainerClient(cfg.containerName || 'bctemplates');
                        logDebug("Using container: ".concat(containerClient.containerName));
                        blockBlobClient = containerClient.getBlockBlobClient(fileName);
                        logDebug("Uploading ".concat(fileName));
                        return [4 /*yield*/, blockBlobClient.upload(xml, xml.length)];
                    case 2:
                        _a.sent();
                        logDebug('Upload succeeded');
                        setDownloadUrl(blockBlobClient.url);
                        logDebug("File URL: ".concat(blockBlobClient.url));
                        return [3 /*break*/, 4];
                    case 3:
                        e_3 = _a.sent();
                        console.error('Upload failed', e_3);
                        logDebug("Upload failed: ".concat(e_3));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    return (React.createElement("div", { className: "app" },
        React.createElement("h1", null, "Business Central Setup"),
        step === 0 && (React.createElement("div", null,
            React.createElement("p", null, "Welcome! This wizard will help you configure Dynamics 365 Business Central."),
            React.createElement("button", { onClick: next }, "Start"))),
        step === 1 && (React.createElement("div", null,
            React.createElement("h2", null, "Company Information"),
            React.createElement("label", null,
                "Company Name:",
                React.createElement("input", { name: "companyName", value: formData.companyName, onChange: handleChange })),
            React.createElement("label", null,
                "Address:",
                React.createElement("input", { name: "address", value: formData.address, onChange: handleChange })),
            React.createElement("label", null,
                "Country:",
                React.createElement("input", { name: "country", value: formData.country, onChange: handleChange })),
            React.createElement("button", { onClick: function () { return askOpenAI('What is a good company name?'); } }, "Need help?"),
            React.createElement("div", { className: "nav" },
                React.createElement("button", { onClick: back }, "Back"),
                React.createElement("button", { onClick: next }, "Next")))),
        step === 2 && (React.createElement("div", null,
            React.createElement("h2", null, "Posting Groups"),
            React.createElement("label", null,
                "General Posting Group:",
                React.createElement("input", { name: "postingGroup", value: formData.postingGroup, onChange: handleChange })),
            React.createElement("div", { className: "nav" },
                React.createElement("button", { onClick: back }, "Back"),
                React.createElement("button", { onClick: next }, "Next")))),
        step === 3 && (React.createElement("div", null,
            React.createElement("h2", null, "Payment Terms"),
            React.createElement("label", null,
                "Terms:",
                React.createElement("input", { name: "paymentTerms", value: formData.paymentTerms, onChange: handleChange })),
            React.createElement("div", { className: "nav" },
                React.createElement("button", { onClick: back }, "Back"),
                React.createElement("button", { onClick: next }, "Next")))),
        step === 4 && (React.createElement("div", null,
            React.createElement("h2", null, "Finish"),
            React.createElement("p", null, "Click below to generate your RapidStart file."),
            React.createElement("button", { onClick: generateCustomRapidStart }, "Generate"),
            downloadUrl && (React.createElement("p", null,
                "File created: ",
                React.createElement("a", { href: downloadUrl }, downloadUrl))),
            debugMessages.length > 0 && (React.createElement("div", { className: "debug" },
                React.createElement("h3", null, "Debug Log"),
                React.createElement("pre", null, debugMessages.join('\n')))),
            React.createElement("div", { className: "nav" },
                React.createElement("button", { onClick: back }, "Back"))))));
}
var container = document.getElementById('root');
ReactDOM.createRoot(container).render(React.createElement(App, null));
