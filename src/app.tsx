import React from "react";
import ReactDOM from "react-dom/client";


const { useState, useEffect, useRef } = React;
import HomePage from './pages/HomePage';
import ConfigMenuPage from './pages/ConfigMenuPage';
import BasicInfoPage from './pages/BasicInfoPage';
import CompanyInfoPage from './pages/CompanyInfoPage';
import FinishPage from './pages/FinishPage';
import GLSetupPage from './pages/GLSetupPage';
import SalesReceivablesPage from './pages/SalesReceivablesPage';
import PurchasePayablesPage from './pages/PurchasePayablesPage';
import FixedAssetSetupPage from './pages/FixedAssetSetupPage';
import CustomersPage from './pages/CustomersPage';
import VendorsPage from './pages/VendorsPage';
import ItemsPage from './pages/ItemsPage';
import CurrencyPage from './pages/CurrencyPage';
import ChartOfAccountsPage from './pages/ChartOfAccountsPage';
import NumberSeriesPage from './pages/NumberSeriesPage';
import CustomerTemplatePage from './pages/CustomerTemplatePage';
import VendorTemplatePage from './pages/VendorTemplatePage';
import ItemTemplatePage from './pages/ItemTemplatePage';
import GLAccountTemplatePage from './pages/GLAccountTemplatePage';
import BankAccountTemplatePage from './pages/BankAccountTemplatePage';
import FixedAssetTemplatePage from './pages/FixedAssetTemplatePage';
import ContactTemplatePage from './pages/ContactTemplatePage';
import EmployeeTemplatePage from './pages/EmployeeTemplatePage';
import ResourceTemplatePage from './pages/ResourceTemplatePage';
import ReviewPage from './pages/ReviewPage';
import OptionalSetupPage from './pages/OptionalSetupPage';
import BCLogo from './images/Dynamics_365_business_Central_Logo.svg';
import strings from '../res/strings';
import { CompanyField, BasicInfo } from './types';
import {
  fieldKey,
  findFieldValue,
  mapFieldName,
  findTableRows,
  extractFieldValues,
  valueToString,
  defaultCurrencyText,
} from "./utils/helpers";
import { parseQuestions, recommendedCode } from "./utils/jsonParsing";
import { loadStartingData, loadConfigTables } from "./utils/dataLoader";
import { getTableFields } from "./utils/schema";
import {
  companyFieldNames,
  glFieldNames,
  srFieldNames,
  ppFieldNames,
  faFieldNames,
} from "./fieldNames";
import { askOpenAI, parseAISuggestion } from "./utils/ai";

interface FormData {
  [key: string]: any;
}

function App() {
  const [step, setStep] = useState(0 as number);
  const [rapidStart, setRapidStart] = useState("" as string);
  const [formData, setFormData] = useState({} as FormData);
  const [basicInfo, setBasicInfo] = useState<BasicInfo>({
    companyName: "",
    industry: "",
    websiteUrl: "",
    description: "",
  });
  const [companyFields, setCompanyFields] = useState([] as CompanyField[]);
  const [glFields, setGlFields] = useState([] as CompanyField[]);
  const [srFields, setSrFields] = useState([] as CompanyField[]);
  const [ppFields, setPpFields] = useState([] as CompanyField[]);
  const [faFields, setFaFields] = useState([] as CompanyField[]);
  const [companyProgress, setCompanyProgress] = useState<boolean[]>([]);
  const [glProgress, setGlProgress] = useState<boolean[]>([]);
  const [srProgress, setSrProgress] = useState<boolean[]>([]);
  const [ppProgress, setPpProgress] = useState<boolean[]>([]);
  const [faProgress, setFaProgress] = useState<boolean[]>([]);
  const [companyVisited, setCompanyVisited] = useState<boolean[]>([]);
  const [glVisited, setGlVisited] = useState<boolean[]>([]);
  const [srVisited, setSrVisited] = useState<boolean[]>([]);
  const [ppVisited, setPpVisited] = useState<boolean[]>([]);
  const [faVisited, setFaVisited] = useState<boolean[]>([]);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [debugMessages, setDebugMessages] = useState([] as string[]);
  const [countries, setCountries] = useState(
    [] as { code: string; name: string }[],
  );
  const [currencies, setCurrencies] = useState(
    [] as { code: string; description: string }[],
  );
  const [customerPostingGroups, setCustomerPostingGroups] = useState<string[]>(
    [],
  );
  const [startData, setStartData] = useState<any>(null);
  const [baseCalendarOptions, setBaseCalendarOptions] = useState(["STANDARD"]);
  const [showAI, setShowAI] = useState(false);
  const [aiSuggested, setAiSuggested] = useState("");
  const [aiExtra, setAiExtra] = useState("");
  const [aiFieldKey, setAiFieldKey] = useState("");
  const [aiPromptBase, setAiPromptBase] = useState("");
  const [configOpen, setConfigOpen] = useState(true);
  const [masterOpen, setMasterOpen] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [basicDone, setBasicDone] = useState(false);
  const [customersDone, setCustomersDone] = useState(false);
  const [vendorsDone, setVendorsDone] = useState(false);
  const [itemsDone, setItemsDone] = useState(false);
  const [currenciesDone, setCurrenciesDone] = useState(false);
  const [chartAccountsDone, setChartAccountsDone] = useState(false);
  const [numberSeriesDone, setNumberSeriesDone] = useState(false);
  const [customerRows, setCustomerRows] = useState<Record<string, string>[]>(
    [],
  );
  const [currencyRows, setCurrencyRows] = useState<Record<string, string>[]>(
    [],
  );
  const [chartRows, setChartRows] = useState<Record<string, string>[]>([]);
  const [numberSeriesRows, setNumberSeriesRows] = useState<Record<string, string>[]>([]);
  const [vendorRows, setVendorRows] = useState<Record<string, string>[]>([]);
  const [companyFieldIdx, setCompanyFieldIdx] = useState<number | null>(null);
  const [glFieldIdx, setGlFieldIdx] = useState<number | null>(null);
  const [srFieldIdx, setSrFieldIdx] = useState<number | null>(null);
  const [ppFieldIdx, setPpFieldIdx] = useState<number | null>(null);
  const [faFieldIdx, setFaFieldIdx] = useState<number | null>(null);
  const [showCompanySometimes, setShowCompanySometimes] = useState(false);
  const [showGLSometimes, setShowGLSometimes] = useState(false);
  const [showSRSometimes, setShowSRSometimes] = useState(false);
  const [showPPSometimes, setShowPPSometimes] = useState(false);
  const [showFASometimes, setShowFASometimes] = useState(false);
  const [companyIntro, setCompanyIntro] = useState(false);
  const [glIntro, setGlIntro] = useState(false);
  const [srIntro, setSrIntro] = useState(false);
  const [ppIntro, setPpIntro] = useState(false);
  const [faIntro, setFaIntro] = useState(false);
  const [aiParsed, setAiParsed] = useState({
    suggested: "",
    confidence: "",
    reasoning: "",
  });

  const suggestionFields = new Set([
    "Country/Region Code",
    "Base Calendar Code",
  ]);

  // Record debug information for the final page
  function logDebug(msg: string): void {
    setDebugMessages((m: string[]) => [...m, msg]);
    console.log(msg);
  }

  // Options used for datalist or select elements for certain fields
  function getDropdownOptions(cf: CompanyField): string[] | null {
    if (cf.field === "Base Calendar Code") {
      return baseCalendarOptions;
    }
    if (cf.field === "Country/Region Code") {
      return countries.map((c) => c.code);
    }
    if (cf.lookupTable && startData) {
      const rows = findTableRows(startData, cf.lookupTable) || [];
      return extractFieldValues(rows, cf.lookupField || "Code");
    }
    return null;
  }

  // Construct the prompt sent to OpenAI
  function buildAIPrompt(
    fieldName: any,
    currentValue: string,
    considerations: string = "",
    options?: string[],
  ): string {
    let name: string;
    if (typeof fieldName === "object" && fieldName !== null) {
      name =
        (fieldName.field as string) ||
        (fieldName.name as string) ||
        (fieldName.label as string) ||
        JSON.stringify(fieldName);
    } else {
      name = String(fieldName);
    }

    let prompt =
      "We are configuring Dynamics Business Central\n\n" +
      "We are looking for a recommended value for the field:\n\n" +
      `${name}\n\n` +
      `The current value is: ${currentValue || "(blank)"}\n\n` +
      "Please us the following information to help determine the recommended value\n--------------\n";

    const parts: string[] = [];

    const addConfirmed = (fields: CompanyField[], progress: boolean[]) => {
      const common = fields.filter((f) => f.common === "common");
      common.forEach((cf, idx) => {
        if (progress[idx]) {
          const val = formData[fieldKey(cf.field)];
          if (val) parts.push(`${cf.field}: ${val}`);
        }
      });
    };

    addConfirmed(companyFields, companyProgress);
    addConfirmed(glFields, glProgress);
    addConfirmed(srFields, srProgress);
    addConfirmed(ppFields, ppProgress);

    if (parts.length) {
      prompt += parts.join("\n") + "\n";
    }

    if (considerations) {
      prompt += `${name} considerations: ${considerations}\n`;
    }

    if (options && options.length) {
      prompt += `Valid options for ${name}: ${options.join(", ")}\n`;
    }

    prompt +=
      '---------------\nPlease return the response strictly as JSON with the properties "Suggested Value", "Confidence", and "Reasoning". ' +
      "Confidence should indicate how certain you are that this is the final value the user will want for this field in Dynamics Business Central. " +
      'Confidence must be one of "Very High", "High", "Medium", "Low", or "Very Low". ' +
      (options && options.length
        ? "Choose a value only from the provided options."
        : "") +
      ' The "Reasoning" text must be no more than 500 characters.';
    return prompt;
  }

  // Query OpenAI for a recommended field value
  async function fetchAISuggestion(field: CompanyField, currentValue: string) {
    const fieldName = field.bcFieldName || field.field;
    const options = getDropdownOptions(field);
    const prompt = buildAIPrompt(
      fieldName,
      currentValue,
      field.considerations || "",
      options || undefined,
    );
    const ans = await askOpenAI(prompt, logDebug);
    const parsed = parseAISuggestion(ans);
    if (options && options.length) {
      const norm = options.map((o) => o.toLowerCase());
      if (!norm.includes(parsed.suggested.trim().toLowerCase())) {
        return { suggested: "", confidence: "", reasoning: "" };
      }
    }
    return parsed;
  }

  // Helper to update a single form value
  function setFieldValue(key: string, value: string) {
    setFormData((f) => ({ ...f, [key]: value }));
  }

  // Track navigation history so the browser back button works
  const popStep = useRef(false);
  const initialLoad = useRef(true);

  useEffect(() => {
    window.history.replaceState({ step: 0 }, '');
    const handler = (e: PopStateEvent) => {
      popStep.current = true;
      if (e.state && typeof e.state.step === 'number') {
        setStep(e.state.step);
      } else {
        setStep(0);
      }
    };
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }
    if (popStep.current) {
      popStep.current = false;
      return;
    }
    window.history.pushState({ step }, '');
  }, [step]);

  useEffect(() => {
    if (step === 3) setCompanyFieldIdx(null);
    if (step === 4) setGlFieldIdx(null);
    if (step === 5) setSrFieldIdx(null);
    if (step === 6) setPpFieldIdx(null);
    if (step === 7) setFaFieldIdx(null);
  }, [step]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  useEffect(() => {
    async function init() {
      try {
        logDebug("Loading starting data");
        const data = await loadStartingData();
        logDebug("Starting data loaded");
        setRapidStart(JSON.stringify(data));
        setStartData(data);

        const countries =
          data?.DataList?.CountryRegionList?.CountryRegion?.map((c: any) => ({
            code: c.Code?.["#text"] || "",
            name: c.Name?.["#text"] || "",
          })) || [];
        setCountries(countries);

        const currencies =
          data?.DataList?.CurrencyList?.Currency?.map((c: any) => ({
            code: c.Code?.["#text"] || "",
            description: c.Description?.["#text"] || "",
          })) || [];
        setCurrencies(currencies);

        const cpgRows = findTableRows(data, 92) || [];
        setCustomerPostingGroups(extractFieldValues(cpgRows, "Code"));

        const vrows = findTableRows(data, 23) || [];
        const vsimple = vrows.map((r) => {
          const obj: Record<string, string> = {};
          Object.keys(r).forEach((k) => {
            let v: any = (r as any)[k];
            obj[k] = valueToString(v);
          });
          return obj;
        });
        setVendorRows(vsimple);

        const customerFields = await getTableFields("Customer", true);
        const customerNames = customerFields.map((f) => f.xmlName);
        const custRows = findTableRows(data, 18) || [];
        logDebug(
          `Customer: read ${custRows.length} rows from NAV27.0.US.ENU.STANDARD.xml`,
        );
        const custSimple = custRows.map((r) => {
          const obj: Record<string, string> = {};
          if (customerNames.length) {
            customerNames.forEach((n) => {
              let v: any = (r as any)[n];
              obj[n] = valueToString(v);
            });
          } else {
            Object.keys(r).forEach((k) => {
              let v: any = (r as any)[k];
              obj[k] = valueToString(v);
            });
          }
          return obj;
        });
        logDebug(`Customer: prepared ${custSimple.length} rows for grid`);
        setCustomerRows(custSimple);

        const currencyFields = await getTableFields("Currency", true);
        const currencyNames = currencyFields.map((f) => f.xmlName);
        const rows = findTableRows(data, 4) || [];
        logDebug(
          `Currency: read ${rows.length} rows from NAV27.0.US.ENU.STANDARD.xml`,
        );
        const simple = rows.map((r) => {
          const obj: Record<string, string> = {};
          if (currencyNames.length) {
            currencyNames.forEach((n) => {
              let v: any = (r as any)[n];
              obj[n] = valueToString(v);
            });
          } else {
            Object.keys(r).forEach((k) => {
              let v: any = (r as any)[k];
              obj[k] = valueToString(v);
            });
          }
          return obj;
        });
        logDebug(`Currency: prepared ${simple.length} rows for grid`);
        setCurrencyRows(simple);

        const glFields = await getTableFields('G/L Account', true);
        const glNames = glFields.map((f) => f.xmlName);
        const glRows = findTableRows(data, 15) || [];
        logDebug(
          `Chart of Accounts: read ${glRows.length} rows from NAV27.0.US.ENU.STANDARD.xml`,
        );
        const glSimple = glRows.map((r) => {
          const obj: Record<string, string> = {};
          if (glNames.length) {
            glNames.forEach((n) => {
              let v: any = (r as any)[n];
              obj[n] = valueToString(v);
            });
          } else {
            Object.keys(r).forEach((k) => {
              let v: any = (r as any)[k];
              obj[k] = valueToString(v);
            });
          }
          return obj;
        });
        logDebug(`Chart of Accounts: prepared ${glSimple.length} rows for grid`);
        setChartRows(glSimple);

        const nsFields = await getTableFields('No. Series', true);
        const nsNames = nsFields.map(f => f.xmlName);
        const nsRows = findTableRows(data, 308) || [];
        logDebug(
          `Number Series: read ${nsRows.length} rows from NAV27.0.US.ENU.STANDARD.xml`,
        );
        const nsSimple = nsRows.map(r => {
          const obj: Record<string, string> = {};
          if (nsNames.length) {
            nsNames.forEach(n => {
              let v: any = (r as any)[n];
              obj[n] = valueToString(v);
            });
          } else {
            Object.keys(r).forEach(k => {
              let v: any = (r as any)[k];
              obj[k] = valueToString(v);
            });
          }
          return obj;
        });
        logDebug(`Number Series: prepared ${nsSimple.length} rows for grid`);
        setNumberSeriesRows(nsSimple);
      } catch (e) {
        console.error("Failed to load starting data", e);
        logDebug(`Failed to load starting data: ${e}`);
      }
    }
    init();
  }, []);

  useEffect(() => {
    if (!aiSuggested) {
      setAiParsed({ suggested: "", confidence: "", reasoning: "" });
      return;
    }
    try {
      setAiParsed(parseAISuggestion(aiSuggested));
    } catch (e) {
      logDebug(`Failed to parse JSON suggestion: ${e}`);
      setAiParsed({ suggested: aiSuggested, confidence: "", reasoning: "" });
    }
  }, [aiSuggested]);

  useEffect(() => {
    if (!startData) return;
    const all = [...companyFields, ...glFields, ...srFields, ...ppFields, ...faFields];
    setFormData((f) => {
      const copy: FormData = { ...f };
      all.forEach((cf) => {
        const key = fieldKey(cf.field);
        if (copy[key]) return;
        const xmlName = mapFieldName(cf.bcFieldName || cf.field);
        let val: any = undefined;
        if (cf.lookupTable) {
          const rows = findTableRows(startData, cf.lookupTable) || [];
          if (rows.length) {
            val = rows[0][xmlName];
            if (val && typeof val === "object" && "#text" in val) {
              val = val["#text"];
            }
          }
        }
        if (val === undefined && cf.tableId) {
          const rows = findTableRows(startData, cf.tableId) || [];
          if (rows.length) {
            val = rows[0][xmlName];
            if (val && typeof val === 'object' && '#text' in val) {
              val = val['#text'];
            }
          }
        }
        if (val === undefined) {
          val = findFieldValue(startData, xmlName);
        }
        if (val !== undefined) {
          if (typeof val === 'object') {
            const textVal = findFieldValue(val, '#text');
            val = typeof textVal === 'string' ? textVal : '';
          }
          copy[key] = val;
        }
      });
      return copy;
    });
  }, [startData, companyFields, glFields, srFields, ppFields, faFields]);

  useEffect(() => {
    const nameKey = fieldKey("Company Name");
    const siteKey = fieldKey("Company Website");
    setFormData((f) => ({
      ...f,
      [nameKey]: basicInfo.companyName || f[nameKey] || "",
      [siteKey]: basicInfo.websiteUrl || f[siteKey] || "",
    }));

    if (companyFields.length) {
      const idxName = companyFields.findIndex(
        (f) => f.field === "Company Name",
      );
      const idxSite = companyFields.findIndex(
        (f) => f.field === "Company Website",
      );

      if (idxName !== -1 && basicInfo.companyName) {
        setCompanyProgress((p) => {
          const arr = [...p];
          arr[idxName] = true;
          return arr;
        });
        setCompanyVisited((v) => {
          const arr = [...v];
          arr[idxName] = true;
          return arr;
        });
      }

      if (idxSite !== -1 && basicInfo.websiteUrl) {
        setCompanyProgress((p) => {
          const arr = [...p];
          arr[idxSite] = true;
          return arr;
        });
        setCompanyVisited((v) => {
          const arr = [...v];
          arr[idxSite] = true;
          return arr;
        });
      }
    }
  }, [basicInfo]);

  useEffect(() => {
    async function init() {
      try {
        logDebug("Loading config tables");
        const data = await loadConfigTables();
        const company = parseQuestions(data, companyFieldNames);
        setCompanyFields(company);
        setCompanyProgress(
          company.filter((f) => f.common === "common").map(() => false),
        );
        setCompanyVisited(
          company.filter((f) => f.common === "common").map(() => false),
        );
        setCompanyIntro(
          (company[0]?.setupOptional || '').toLowerCase() === 'yes'
        );
        setFormData((f: FormData) => {
          const copy: FormData = { ...f };
          company.forEach((cf) => {
            const key = fieldKey(cf.field);
            if (!(key in copy)) copy[key] = "";
          });
          return copy;
        });

        const gl = parseQuestions(data, glFieldNames);
        setGlFields(gl);
        setGlProgress(gl.filter((f) => f.common === "common").map(() => false));
        setGlVisited(gl.filter((f) => f.common === "common").map(() => false));
        setGlIntro((gl[0]?.setupOptional || '').toLowerCase() === 'yes');
        setFormData((f: FormData) => {
          const copy: FormData = { ...f };
          gl.forEach((cf) => {
            const key = fieldKey(cf.field);
            if (!(key in copy)) copy[key] = "";
          });
          return copy;
        });

        const sr = parseQuestions(data, srFieldNames);
        setSrFields(sr);
        setSrProgress(sr.filter((f) => f.common === "common").map(() => false));
        setSrVisited(sr.filter((f) => f.common === "common").map(() => false));
        setSrIntro((sr[0]?.setupOptional || '').toLowerCase() === 'yes');
        setFormData((f: FormData) => {
          const copy: FormData = { ...f };
          sr.forEach((cf) => {
            const key = fieldKey(cf.field);
            if (!(key in copy)) copy[key] = "";
          });
          return copy;
        });

        const pp = parseQuestions(data, ppFieldNames);
        setPpFields(pp);
        setPpProgress(pp.filter((f) => f.common === "common").map(() => false));
        setPpVisited(pp.filter((f) => f.common === "common").map(() => false));
        setPpIntro((pp[0]?.setupOptional || '').toLowerCase() === 'yes');
        setFormData((f: FormData) => {
          const copy: FormData = { ...f };
          pp.forEach((cf) => {
            const key = fieldKey(cf.field);
            if (!(key in copy)) copy[key] = "";
          });
          return copy;
        });

        const fa = parseQuestions(data, faFieldNames);
        setFaFields(fa);
        setFaProgress(fa.filter((f) => f.common === "common").map(() => false));
        setFaVisited(fa.filter((f) => f.common === "common").map(() => false));
        setFaIntro((fa[0]?.setupOptional || '').toLowerCase() === 'yes');
        setFormData((f: FormData) => {
          const copy: FormData = { ...f };
          fa.forEach((cf) => {
            const key = fieldKey(cf.field);
            if (!(key in copy)) copy[key] = "";
          });
          return copy;
        });
      } catch (e) {
        console.error("Failed to load config tables", e);
        logDebug(`Failed to load config tables: ${e}`);
      }
    }
    init();
  }, []);

  // Generic change handler for all inputs
  function handleChange(e: any) {
    const { name, type, value, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files && files[0] ? files[0] : null });
      return;
    }
    setFormData({ ...formData, [name]: value });
    if (name in basicInfo) {
      setBasicInfo({ ...basicInfo, [name as keyof BasicInfo]: value });
    }
  }

  // Validation and option caching on blur
  function handleBlur(e: any): void {
    if (!e.target.checkValidity()) {
      alert("Invalid value");
    }
    const { name, value } = e.target;
    if (name === fieldKey("Base Calendar Code")) {
      if (value && !baseCalendarOptions.includes(value)) {
        setBaseCalendarOptions([...baseCalendarOptions, value]);
      }
    } else if (name === fieldKey("Country/Region Code")) {
      if (value && !countries.find((c) => c.code === value)) {
        setCountries([...countries, { code: value, name: value }]);
      }
    } else if (name === fieldKey("Local Currency (LCY) Code")) {
      if (value && !currencies.find((c) => c.code === value)) {
        setCurrencies([...currencies, { code: value, description: value }]);
      }
    }
  }

  useEffect(() => {
    setCurrencies((prev) => {
      const map = new Map(prev.map((c) => [c.code, c]));
      currencyRows.forEach((r) => {
        const code = r.Code || r["Code"];
        if (code && !map.has(code)) {
          map.set(code, { code, description: r.Description || "" });
        }
      });
      return Array.from(map.values());
    });
  }, [currencyRows]);

  useEffect(() => {
    setCountries((prev) => {
      const arr = [...prev];
      customerRows.forEach((r) => {
        const code =
          r.CountryRegionCode ||
          (r as any)["Country_Region_Code"] ||
          (r as any)["Country/Region Code"];
        if (code && !arr.find((c) => c.code === code)) {
          arr.push({ code, name: code });
        }
      });
      return arr;
    });
    setCustomerPostingGroups((prev) => {
      const arr = [...prev];
      customerRows.forEach((r) => {
        const pg =
          r.CustomerPostingGroup ||
          (r as any)["Customer_Posting_Group"] ||
          (r as any)["Customer Posting Group"];
        if (pg && !arr.includes(pg)) arr.push(pg);
      });
      return arr;
    });
  }, [customerRows]);

  // Advance to the next wizard step
  function next(): void {
    if (step === 2) setBasicDone(true);
    if (step === 8) setCustomersDone(true);
    if (step === 9) setVendorsDone(true);
    if (step === 10) setItemsDone(true);
    if (step === 11) {
      setCurrenciesDone(true);
      setStep(1);
      return;
    }
    if (step === 12) {
      setChartAccountsDone(true);
      setStep(1);
      return;
    }
    if (step === 13) {
      setNumberSeriesDone(true);
      setStep(1);
      return;
    }
    if (step === 22) {
      setStep(1);
      return;
    }
    setStep(step + 1);
  }

  // Go back one step
  function back(): void {
    window.history.back();
  }

  // Return to the main menu
  function goHome(): void {
    setStep(1);
  }

  // Show dialog with AI suggested value
  function openAIDialog(
    field: CompanyField,
    key: string,
    currentValue: string,
    considerations: string = "",
  ): void {
    const fieldName = field.bcFieldName || field.field;
    const options = getDropdownOptions(field);
    const prompt = buildAIPrompt(
      fieldName,
      currentValue,
      considerations,
      options || undefined,
    );
    setAiPromptBase(prompt);
    setAiExtra("");
    setAiFieldKey(key);
    setAiSuggested("");
    setShowAI(true);
    askOpenAI(prompt, logDebug).then((ans) => setAiSuggested(ans));
  }

  // Hide the AI dialog
  function closeAIDialog(): void {
    setShowAI(false);
  }

  // Request another suggestion using extra user instructions
  function askAgain(): void {
    const prompt = `${aiPromptBase} Additional Instructions: ${aiExtra}`;
    setAiSuggested("");
    askOpenAI(prompt, logDebug).then((ans) => setAiSuggested(ans));
  }

  // User accepts the AI suggested value
  function acceptSuggested() {
    try {
      const val = aiParsed.suggested;
      setFormData((f) => ({ ...f, [aiFieldKey]: val }));
    } catch (e) {
      console.error(e);
      logDebug(`Failed to accept suggestion: ${e}`);
    } finally {
      closeAIDialog();
    }
  }

  // Apply the canned recommendation for a field
  function applyRecommendedValue(cf: CompanyField) {
    const key = fieldKey(cf.field);
    setFormData((f) => ({ ...f, [key]: recommendedCode(cf.recommended) }));
  }

  // Prompt the user before applying the recommended value
  function handleRecommended(cf: CompanyField) {
    if (cf.recommended) {
      const rec = recommendedCode(cf.recommended);
      if (window.confirm(`Suggested value: ${rec}. Use it?`)) {
        applyRecommendedValue(cf);
      }
    }
  }

  function confirmAll(
    progress: boolean[],
    setProg: (arr: boolean[]) => void,
    visited: boolean[],
    setVisitedArr: (arr: boolean[]) => void,
  ) {
    setProg(progress.map(() => true));
    setVisitedArr(visited.map(() => true));
  }

  // Upload a basic RapidStart template to Azure
  async function generateCustomRapidStart(): Promise<void> {
    logDebug("Preparing RapidStart XML");
    const currencyXml = currencyRows
      .map((r) => {
        const fields = Object.entries(r)
          .map(([k, v]) => `    <${k}>${v}</${k}>`)
          .join("\n");
        return `  <Currency>\n${fields}\n  </Currency>`;
      })
      .join("\n");
    const xml = `<?xml version="1.0"?>\n<CustomRapidStart>\n  <CompanyName>${formData.companyName}</CompanyName>\n  <Address>${formData.address}</Address>\n  <Country>${formData.country}</Country>\n  <CurrencyList>\n${currencyXml}\n  </CurrencyList>\n</CustomRapidStart>`;

    const fileName = `${(formData.companyName || "CustomRapidStart").replace(
      /\s+/g,
      "_",
    )}.rapidstart`;

    try {
      const cfg = (window as any).azureStorageConfig || {};
      if (!cfg.connectionString) {
        throw new Error("Azure connection string not configured");
      }
      logDebug("Connecting to Azure Blob Storage");
      const az = (window as any).azblob;
      if (!az) {
        throw new Error("Azure Storage library not loaded");
      }
      const blobServiceClient = az.BlobServiceClient.fromConnectionString(
        cfg.connectionString,
      );
      const containerClient = blobServiceClient.getContainerClient(
        cfg.containerName || "bctemplates",
      );
      logDebug(`Using container: ${containerClient.containerName}`);
      const blockBlobClient = containerClient.getBlockBlobClient(fileName);
      logDebug(`Uploading ${fileName}`);
      await blockBlobClient.upload(xml, xml.length);
      logDebug("Upload succeeded");
      setDownloadUrl(blockBlobClient.url);
      logDebug(`File URL: ${blockBlobClient.url}`);
    } catch (e) {
      console.error("Upload failed", e);
      logDebug(`Upload failed: ${e}`);
    }
  }

  // Render an input element appropriate for the given field
  function renderInput(cf: CompanyField) {
    const key = fieldKey(cf.field);
    const val = formData[key] || "";
    let inputProps: any = {
      name: key,
      value: val,
      onChange: handleChange,
      onBlur: handleBlur,
    };
    if (cf.fieldType === "Boolean") {
      return (
        <>
          <label>
            <input
              type="radio"
              name={key}
              value="1"
              checked={val === "1"}
              onChange={handleChange}
            />{" "}
            Yes
          </label>
          <label>
            <input
              type="radio"
              name={key}
              value="0"
              checked={val === "0"}
              onChange={handleChange}
            />{" "}
            No
          </label>
          <label>
            <input
              type="radio"
              name={key}
              value=""
              checked={val === ""}
              onChange={handleChange}
            />{" "}
            I'm not sure
          </label>
        </>
      );
    }
    if (/phone/i.test(cf.field)) {
      inputProps.type = "tel";
      inputProps.pattern = "[0-9+()\- ]+";
    } else if (cf.fieldType === "Date" || /date/i.test(cf.field)) {
      inputProps.type = "date";
    } else if (/number|amount|qty|quantity/i.test(cf.field)) {
      inputProps.type = "number";
    }

    let inputEl: any = <input {...inputProps} />;
    if (/address|description|notes|comment/i.test(cf.field)) {
      inputEl = <textarea {...inputProps} rows={4} />;
    }
    if (cf.field === "Logo (Picture)") {
      inputEl = <input type="file" name={key} onChange={handleChange} />;
    } else if (cf.field === "Base Calendar Code") {
      inputEl = (
        <>
          <input
            list="base-calendar-list"
            name={key}
            value={val}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <datalist id="base-calendar-list">
            <option value="" />
            {baseCalendarOptions.map((o) => (
              <option key={o} value={o} />
            ))}
          </datalist>
        </>
      );
    } else if (cf.field === "Country/Region Code") {
      inputEl = (
        <>
          <input
            list="country-list"
            name={key}
            value={val}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <datalist id="country-list">
            <option value="" />
            {countries.map((c: { code: string; name: string }) => (
              <option key={c.code} value={c.code}>
                {c.name || c.code}
              </option>
            ))}
          </datalist>
        </>
      );
    } else if (cf.field === "Local Currency (LCY) Code") {
      inputEl = <input {...inputProps} />;
    } else if (cf.lookupTable && startData) {
      const rows = findTableRows(startData, cf.lookupTable) || [];
      let opts = extractFieldValues(rows, cf.lookupField || "Code");
      const isCurrency = cf.lookupTable === 4;
      const lcy = formData[fieldKey("Local Currency (LCY) Code")] || "";
      if (isCurrency && lcy) {
        const norm = lcy.trim().toLowerCase();
        opts = opts.filter((o) => o.trim().toLowerCase() !== norm && o.trim() !== "");
      } else {
        opts = opts.filter((o) => o.trim() !== "");
      }
      const defText = isCurrency ? defaultCurrencyText(lcy.trim()) : "";
      inputEl = (
        <select {...inputProps}>
          <option value="">{defText}</option>
          {opts.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      );
    }

    return (
      <>
        {inputEl}
        {/* recommended icon moved to FieldSubPage */}
        <button
          type="button"
          className="ai-btn"
          title="Ask AI to help"
          onClick={() => openAIDialog(cf, key, val, cf.considerations)}
        >
          <span className="icon">✨</span>
          Ask AI to help
        </button>
      </>
    );
  }

  // Render a single row in the review table
  function renderField(cf: CompanyField) {
    const key = fieldKey(cf.field);
    return (
      <div className="field-row" key={key}>
        <div className="field-name">{cf.field}</div>
        <div className="field-input">{renderInput(cf)}</div>
        <div className="field-considerations">{cf.considerations}</div>
      </div>
    );
  }

  const companyDone =
    companyProgress.length > 0 && companyProgress.every(Boolean);
  const companyInProgress = !companyDone && companyProgress.some(Boolean);
  const glDone = glProgress.length > 0 && glProgress.every(Boolean);
  const glInProgress = !glDone && glProgress.some(Boolean);
  const srDone = srProgress.length > 0 && srProgress.every(Boolean);
  const srInProgress = !srDone && srProgress.some(Boolean);
  const ppDone = ppProgress.length > 0 && ppProgress.every(Boolean);
  const ppInProgress = !ppDone && ppProgress.some(Boolean);
  const faDone = faProgress.length > 0 && faProgress.every(Boolean);
  const faInProgress = !faDone && faProgress.some(Boolean);
  const configSectionDone = companyDone && glDone && srDone && ppDone && faDone;
  const masterSectionDone =
    customersDone &&
    vendorsDone &&
    itemsDone &&
    currenciesDone &&
    chartAccountsDone &&
    numberSeriesDone;
  const currentGroup = (() => {
    if (step === 2) return "basic";
    if ([3, 4, 5, 6, 7].includes(step)) return "config";
    if ([8, 9, 10, 11, 12, 13].includes(step)) return "master";
    if ([14, 15, 16, 17, 18, 19, 20, 21, 22].includes(step)) return "template";
    if (step === 23) return "review";
    return "";
  })();

  const progressPercent = (() => {
    switch (currentGroup) {
      case "basic":
        return 20;
      case "config":
        return 40;
      case "master":
        return 60;
      case "template":
        return 80;
      case "review":
        return 100;
      default:
        return 0;
    }
  })();

  if (step === 0) {
    return (
      <div className="app">
        <HomePage next={next} />
      </div>
    );
  }

  return (
    <div className="app">
      <div className="topbar">
        <div className="home-link" onClick={() => setStep(1)}>
          Home
        </div>
        <div className="actions">
          <span>{strings.search}</span>
          <button className="help-btn">{strings.help}</button>
        </div>
      </div>
      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar-header">
            <img src={BCLogo} alt="BC" className="logo" />
            <h2>Setup Business Central</h2>
          </div>
          <nav>
            <div className="group">
              <div className="group-title" onClick={() => setStep(2)}>
                {basicDone && <span className="check">✔</span>}
                {strings.basicInfo}
              </div>
            </div>
            <div className="group">
              <div
                className="group-title"
                onClick={() => setConfigOpen(!configOpen)}
              >
                <span className="toggle">{configOpen ? "-" : "+"}</span>
                {configSectionDone && <span className="check">✔</span>}
                {strings.configurationData}
              </div>
              {configOpen && (
                <ul>
                  <li
                    onClick={() => {
                      setCompanyFieldIdx(null);
                      setStep(3);
                    }}
                  >
                    {companyDone && <span className="check">✔</span>}
                    {!companyDone && companyInProgress && (
                      <span className="progress-dot">•</span>
                    )}
                    {strings.companyInfo}
                  </li>
                  {step === 3 && (
                    <ul className="subnav">
                      {companyFields
                        .filter(
                          (f) =>
                            f.common === "common" ||
                            (showCompanySometimes && f.common === "sometimes"),
                        )
                        .map((f, i) => (
                          <li
                            key={f.field}
                            className={companyFieldIdx === i ? "active" : ""}
                            onClick={() => {
                              setCompanyFieldIdx(i);
                              setStep(3);
                            }}
                          >
                            {companyProgress[i] && (
                              <span className="check">✔</span>
                            )}
                            {f.field}
                          </li>
                        ))}
                    </ul>
                  )}
                  <li
                    onClick={() => {
                      setGlFieldIdx(null);
                      setStep(4);
                    }}
                  >
                    {glDone && <span className="check">✔</span>}
                    {!glDone && glInProgress && (
                      <span className="progress-dot">•</span>
                    )}
                    {strings.generalLedgerSetup}
                  </li>
                  {step === 4 && (
                    <ul className="subnav">
                      {glFields
                        .filter(
                          (f) =>
                            f.common === "common" ||
                            (showGLSometimes && f.common === "sometimes"),
                        )
                        .map((f, i) => (
                          <li
                            key={f.field}
                            className={glFieldIdx === i ? "active" : ""}
                            onClick={() => {
                              setGlFieldIdx(i);
                              setStep(4);
                            }}
                          >
                            {glProgress[i] && <span className="check">✔</span>}
                            {f.field}
                          </li>
                        ))}
                    </ul>
                  )}
                  <li
                    onClick={() => {
                      setSrFieldIdx(null);
                      setStep(5);
                    }}
                  >
                    {srDone && <span className="check">✔</span>}
                    {!srDone && srInProgress && (
                      <span className="progress-dot">•</span>
                    )}
                    {strings.salesReceivablesSetup}
                  </li>
                  {step === 5 && (
                    <ul className="subnav">
                  {srFields
                    .filter(
                      f =>
                        f.common === 'common' ||
                        (showSRSometimes && f.common === 'sometimes')
                    )
                    .map((f, i) => (
                      <li
                        key={f.field}
                        className={srFieldIdx === i ? 'active' : ''}
                        onClick={() => {
                          setSrFieldIdx(i);
                          setStep(5);
                        }}
                      >
                        {srProgress[i] && <span className="check">✔</span>}
                        {f.field}
                      </li>
                    ))}
                </ul>
              )}
              <li
                onClick={() => {
                  setPpFieldIdx(null);
                  setStep(6);
                }}
              >
                {ppDone && <span className="check">✔</span>}
                {!ppDone && ppInProgress && (
                  <span className="progress-dot">•</span>
                )}
                {strings.purchasePayablesSetup}
              </li>
              {step === 6 && (
                <ul className="subnav">
                  {ppFields
                    .filter(
                      f =>
                        f.common === 'common' ||
                        (showPPSometimes && f.common === 'sometimes')
                    )
                    .map((f, i) => (
                      <li
                        key={f.field}
                        className={ppFieldIdx === i ? 'active' : ''}
                        onClick={() => {
                          setPpFieldIdx(i);
                          setStep(6);
                        }}
                      >
                        {ppProgress[i] && <span className="check">✔</span>}
                        {f.field}
                      </li>
                    ))}
                </ul>
              )}
            </ul>
          )}
        </div>
        <div className="group">
              <div
                className="group-title"
                onClick={() => setMasterOpen(!masterOpen)}
              >
                <span className="toggle">{masterOpen ? "-" : "+"}</span>
                {masterSectionDone && <span className="check">✔</span>}
                {strings.masterData}
              </div>
              {masterOpen && (
                <ul>
                  <li onClick={() => setStep(8)}>
                    {customersDone && <span className="check">✔</span>}
                    {strings.customers}
                  </li>
                  <li onClick={() => setStep(9)}>
                    {vendorsDone && <span className="check">✔</span>}
                    {strings.vendors}
                  </li>
                  <li onClick={() => setStep(10)}>
                    {itemsDone && <span className="check">✔</span>}
                    {strings.items}
                  </li>
                  <li onClick={() => setStep(11)}>
                    {currenciesDone && <span className="check">✔</span>}
                    {strings.currencies}
                  </li>
                  <li onClick={() => setStep(12)}>
                    {chartAccountsDone && <span className="check">✔</span>}
                    {strings.chartOfAccounts}
                  </li>
                  <li onClick={() => setStep(13)}>
                    {numberSeriesDone && <span className="check">✔</span>}
                    {strings.numberSeries}
                  </li>
                </ul>
              )}
            </div>
            <div className="group">
              <div
                className="group-title"
                onClick={() => setTemplatesOpen(!templatesOpen)}
              >
                <span className="toggle">{templatesOpen ? "-" : "+"}</span>
                {strings.configureTemplates}
              </div>
              {templatesOpen && (
                <ul>
                  <li onClick={() => setStep(14)}>
                    {strings.customerTemplate}
                  </li>
                  <li onClick={() => setStep(15)}>{strings.vendorTemplate}</li>
                  <li onClick={() => setStep(16)}>{strings.itemTemplate}</li>
                  <li onClick={() => setStep(17)}>
                    {strings.glAccountTemplate}
                  </li>
                  <li onClick={() => setStep(18)}>
                    {strings.bankAccountTemplate}
                  </li>
                  <li onClick={() => setStep(19)}>
                    {strings.fixedAssetTemplate}
                  </li>
                  <li onClick={() => setStep(20)}>{strings.contactTemplate}</li>
                  <li onClick={() => setStep(21)}>
                    {strings.employeeTemplate}
                  </li>
                  <li onClick={() => setStep(22)}>
                    {strings.resourceTemplate}
                  </li>
                </ul>
              )}
            </div>
          </nav>
          <div className="review-footer">
            <button className="next-btn review-btn" onClick={() => setStep(23)}>
              {strings.reviewAndFinish}
            </button>
          </div>
        </aside>
        <div className="content">
          <div className="page-area">
            <div className="progress-area">
              <div className="progress-slider">
                <div
                  className={`progress-step ${currentGroup === "basic" ? "active" : ""} clickable`}
                  onClick={() => setStep(2)}
                >
                  <div className="circle">1</div>
                  <span>{strings.basicInfoTitle}</span>
                </div>
                <div
                  className={`progress-step ${currentGroup === "config" ? "active" : ""} clickable`}
                  onClick={() => setStep(3)}
                >
                  <div className="circle">2</div>
                  <span>{strings.configurationData}</span>
                </div>
                <div
                  className={`progress-step ${currentGroup === "master" ? "active" : ""} clickable`}
                  onClick={() => setStep(8)}
                >
                  <div className="circle">3</div>
                  <span>{strings.masterData}</span>
                </div>
                <div
                  className={`progress-step ${currentGroup === "template" ? "active" : ""} clickable`}
                  onClick={() => setStep(14)}
                >
                  <div className="circle">4</div>
                  <span>{strings.configureTemplates}</span>
                </div>
                <div
                  className={`progress-step ${currentGroup === "review" ? "active" : ""} clickable`}
                  onClick={() => setStep(23)}
                >
                  <div className="circle">5</div>
                  <span>{strings.reviewAndFinish}</span>
                </div>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
            <main className="main">
              {step === 0 && <HomePage next={next} />}
              {step === 1 && (
                <ConfigMenuPage
                  goToBasicInfo={() => setStep(2)}
                  goToCompanyInfo={() => {
                    setCompanyFieldIdx(null);
                    setStep(3);
                  }}
                  goToGLSetup={() => {
                    setGlFieldIdx(null);
                    setStep(4);
                  }}
                  goToSRSetup={() => {
                    setSrFieldIdx(null);
                    setStep(5);
                  }}
                  goToPPSetup={() => {
                    setPpFieldIdx(null);
                    setStep(6);
                  }}
                  goToFASetup={() => {
                    setFaFieldIdx(null);
                    setStep(7);
                  }}
                  goToCustomers={() => setStep(8)}
                  goToVendors={() => setStep(9)}
                  goToItems={() => setStep(10)}
                  goToCurrencies={() => setStep(11)}
                  goToChartOfAccounts={() => setStep(12)}
                  goToNumberSeries={() => setStep(13)}
                  goToCustomerTemplate={() => setStep(14)}
                  goToVendorTemplate={() => setStep(15)}
                  goToItemTemplate={() => setStep(16)}
                  goToGLAccountTemplate={() => setStep(17)}
                  goToBankAccountTemplate={() => setStep(18)}
                  goToFixedAssetTemplate={() => setStep(19)}
                  goToContactTemplate={() => setStep(20)}
                  goToEmployeeTemplate={() => setStep(21)}
                  goToResourceTemplate={() => setStep(22)}
                  back={back}
                  basicDone={basicDone}
                  companyDone={companyDone}
                  companyInProgress={companyInProgress}
                  glDone={glDone}
                  glInProgress={glInProgress}
                  srDone={srDone}
                  srInProgress={srInProgress}
                  ppDone={ppDone}
                  ppInProgress={ppInProgress}
                  faDone={faDone}
                  faInProgress={faInProgress}
                  customersDone={customersDone}
                  vendorsDone={vendorsDone}
                  itemsDone={itemsDone}
                  currenciesDone={currenciesDone}
                  chartAccountsDone={chartAccountsDone}
                  numberSeriesDone={numberSeriesDone}
                />
              )}
              {step === 2 && (
                <BasicInfoPage
                  formData={basicInfo}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  next={next}
                  back={() => setStep(1)}
                  confirmed={basicDone}
                  setConfirmed={setBasicDone}
                />
              )}
              {step === 3 && companyIntro && (
                <OptionalSetupPage
                  title={strings.companyInfo}
                  fields={companyFields}
                  formData={formData}
                  onUseDefaults={() => {
                    confirmAll(
                      companyProgress,
                      setCompanyProgress,
                      companyVisited,
                      setCompanyVisited,
                    );
                    setCompanyIntro(false);
                    next();
                  }}
                  onReview={() => {
                    setCompanyIntro(false);
                  }}
                  onSkip={() => {
                    next();
                  }}
                />
              )}
              {step === 3 && !companyIntro && (
                <CompanyInfoPage
                  fields={companyFields}
                  renderInput={renderInput}
                  handleRecommended={handleRecommended}
                  next={next}
                  back={() => setStep(1)}
                  progress={companyProgress}
                  setProgress={setCompanyProgress}
                  visited={companyVisited}
                  setVisited={setCompanyVisited}
                  formData={formData}
                  onShowSometimes={() => setShowCompanySometimes(true)}
                  fetchAISuggestion={fetchAISuggestion}
                  setFieldValue={setFieldValue}
                  onFieldIndexChange={setCompanyFieldIdx}
                  goToFieldIndex={companyFieldIdx}
                />
              )}
              {step === 4 && glIntro && (
                <OptionalSetupPage
                  title={strings.generalLedgerSetup}
                  fields={glFields}
                  formData={formData}
                  onUseDefaults={() => {
                    confirmAll(
                      glProgress,
                      setGlProgress,
                      glVisited,
                      setGlVisited,
                    );
                    setGlIntro(false);
                    next();
                  }}
                  onReview={() => {
                    setGlIntro(false);
                  }}
                  onSkip={() => {
                    next();
                  }}
                />
              )}
              {step === 4 && !glIntro && (
                <GLSetupPage
                  fields={glFields}
                  renderInput={renderInput}
                  handleRecommended={handleRecommended}
                  next={next}
                  back={back}
                  progress={glProgress}
                  setProgress={setGlProgress}
                  visited={glVisited}
                  setVisited={setGlVisited}
                  formData={formData}
                  onShowSometimes={() => setShowGLSometimes(true)}
                  fetchAISuggestion={fetchAISuggestion}
                  setFieldValue={setFieldValue}
                  onFieldIndexChange={setGlFieldIdx}
                  goToFieldIndex={glFieldIdx}
                />
              )}
              {step === 5 && srIntro && (
                <OptionalSetupPage
                  title={strings.salesReceivablesSetup}
                  fields={srFields}
                  formData={formData}
                  onUseDefaults={() => {
                    confirmAll(
                      srProgress,
                      setSrProgress,
                      srVisited,
                      setSrVisited,
                    );
                    setSrIntro(false);
                    next();
                  }}
                  onReview={() => {
                    setSrIntro(false);
                  }}
                  onSkip={() => {
                    next();
                  }}
                />
              )}
              {step === 5 && !srIntro && (
                <SalesReceivablesPage
                  fields={srFields}
                  renderInput={renderInput}
                  handleRecommended={handleRecommended}
                  next={next}
                  back={back}
                  progress={srProgress}
                  setProgress={setSrProgress}
                  visited={srVisited}
                  setVisited={setSrVisited}
                  formData={formData}
                  onShowSometimes={() => setShowSRSometimes(true)}
                  fetchAISuggestion={fetchAISuggestion}
                  setFieldValue={setFieldValue}
                  onFieldIndexChange={setSrFieldIdx}
                  goToFieldIndex={srFieldIdx}
                />
              )}
              {step === 6 && ppIntro && (
                <OptionalSetupPage
                  title={strings.purchasePayablesSetup}
                  fields={ppFields}
                  formData={formData}
                  onUseDefaults={() => {
                    confirmAll(
                      ppProgress,
                      setPpProgress,
                      ppVisited,
                      setPpVisited,
                    );
                    setPpIntro(false);
                    next();
                  }}
                  onReview={() => {
                    setPpIntro(false);
                  }}
                  onSkip={() => {
                    next();
                  }}
                />
              )}
              {step === 6 && !ppIntro && (
                <PurchasePayablesPage
                  fields={ppFields}
                  renderInput={renderInput}
                  handleRecommended={handleRecommended}
                  next={next}
                  back={back}
                  progress={ppProgress}
                  setProgress={setPpProgress}
                  visited={ppVisited}
                  setVisited={setPpVisited}
                  formData={formData}
                  onShowSometimes={() => setShowPPSometimes(true)}
                  fetchAISuggestion={fetchAISuggestion}
                  setFieldValue={setFieldValue}
                  onFieldIndexChange={setPpFieldIdx}
                  goToFieldIndex={ppFieldIdx}
                />
              )}
              {step === 7 && faIntro && (
                <OptionalSetupPage
                  title={strings.fixedAssetSetup}
                  fields={faFields}
                  formData={formData}
                  onUseDefaults={() => {
                    confirmAll(
                      faProgress,
                      setFaProgress,
                      faVisited,
                      setFaVisited,
                    );
                    setFaIntro(false);
                    next();
                  }}
                  onReview={() => {
                    setFaIntro(false);
                  }}
                  onSkip={() => {
                    next();
                  }}
                />
              )}
              {step === 7 && !faIntro && (
                <FixedAssetSetupPage
                  fields={faFields}
                  renderInput={renderInput}
                  handleRecommended={handleRecommended}
                  next={next}
                  back={back}
                  progress={faProgress}
                  setProgress={setFaProgress}
                  visited={faVisited}
                  setVisited={setFaVisited}
                  formData={formData}
                  onShowSometimes={() => setShowFASometimes(true)}
                  fetchAISuggestion={fetchAISuggestion}
                  setFieldValue={setFieldValue}
                  onFieldIndexChange={setFaFieldIdx}
                  goToFieldIndex={faFieldIdx}
                />
              )}
              {step === 8 && (
                <CustomersPage
                  rows={customerRows}
                  setRows={setCustomerRows}
                  next={next}
                  back={back}
                  logDebug={logDebug}
                  formData={formData}
                  confirmed={customersDone}
                  setConfirmed={setCustomersDone}
                  countries={countries}
                  setCountries={setCountries}
                  currencies={currencies}
                  setCurrencies={setCurrencies}
                  postingGroups={customerPostingGroups}
                  setPostingGroups={setCustomerPostingGroups}
                />
              )}
              {step === 9 && (
                <VendorsPage rows={vendorRows} next={next} back={back} />
              )}
              {step === 10 && <ItemsPage next={next} back={back} />}
              {step === 11 && (
                <CurrencyPage
                  rows={currencyRows}
                  setRows={setCurrencyRows}
                  next={next}
                  back={back}
                  logDebug={logDebug}
                  formData={formData}
                  confirmed={currenciesDone}
                  setConfirmed={setCurrenciesDone}
                />
              )}
              {step === 12 && (
                <ChartOfAccountsPage
                  rows={chartRows}
                  setRows={setChartRows}
                  next={next}
                  back={back}
                  logDebug={logDebug}
                  formData={formData}
                  confirmed={chartAccountsDone}
                  setConfirmed={setChartAccountsDone}
                />
              )}
              {step === 13 && (
                <NumberSeriesPage
                  rows={numberSeriesRows}
                  setRows={setNumberSeriesRows}
                  next={next}
                  back={back}
                  logDebug={logDebug}
                  formData={formData}
                  confirmed={numberSeriesDone}
                  setConfirmed={setNumberSeriesDone}
                />
              )}
              {step === 14 && <CustomerTemplatePage next={next} back={back} />}
              {step === 15 && <VendorTemplatePage next={next} back={back} />}
              {step === 16 && <ItemTemplatePage next={next} back={back} />}
              {step === 17 && <GLAccountTemplatePage next={next} back={back} />}
              {step === 18 && (
                <BankAccountTemplatePage next={next} back={back} />
              )}
              {step === 19 && (
                <FixedAssetTemplatePage next={next} back={back} />
              )}
              {step === 20 && <ContactTemplatePage next={next} back={back} />}
              {step === 21 && <EmployeeTemplatePage next={next} back={back} />}
              {step === 22 && <ResourceTemplatePage next={next} back={back} />}
              {step === 23 && (
                <ReviewPage
                  fields={[
                    ...companyFields,
                    ...glFields,
                    ...srFields,
                    ...ppFields,
                    ...faFields,
                  ]}
                  formData={formData}
                  back={back}
                  next={next}
                />
              )}
              {step === 24 && (
                <FinishPage
                  generate={generateCustomRapidStart}
                  back={back}
                  downloadUrl={downloadUrl}
                  debugMessages={debugMessages}
                />
              )}
            </main>
          </div>
          {showAI && (
            <div className="modal-overlay" onClick={closeAIDialog}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="suggested-box">
                  <div className="suggested-label">Suggested Value</div>
                  <div className="suggested-value">
                    {aiParsed.suggested || "Loading..."}
                  </div>
                </div>
                {aiParsed.confidence &&
                  (aiParsed.confidence.trim().toLowerCase() === "very high" ? (
                    <div className="ai-valid">
                      AI returned a result it believes is valid
                    </div>
                  ) : (
                    <div className="ai-warning">
                      Not Confident -- please review carefully
                    </div>
                  ))}
                <div className="ai-answer">
                  <strong>Why did AI suggest this?:</strong>{" "}
                  {aiParsed.reasoning}
                </div>
                <label htmlFor="ai-extra" className="ai-extra-label">
                  Additional Instructions
                </label>
                <textarea
                  id="ai-extra"
                  value={aiExtra}
                  onChange={(e) => setAiExtra(e.target.value)}
                  rows={6}
                />
                <button className="go-btn" onClick={askAgain}>
                  SUGGEST AGAIN
                </button>
                <div className="nav modal-actions">
                  <button className="next-btn" onClick={acceptSuggested}>
                    Accept
                  </button>
                  <button className="next-btn" onClick={closeAIDialog}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const container = document.getElementById("root") as HTMLElement;
ReactDOM.createRoot(container).render(<App />);

export default App;
